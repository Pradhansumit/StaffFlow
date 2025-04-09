import traceback
import uuid
from datetime import datetime, time
from decimal import Decimal

import pandas
from accounts.models import CustomUser
from accounts.permission import Admin_Permission
from attendance.models import Attendance
from django.db.models import Sum
from django.utils import timezone
from holiday.models import Holiday
from leave.models import LeaveRequest
from payment.models import BasicSalary, MonthlySalary
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class Admin_Add_Employee_Basic_Salary(APIView):
    def post(self, request) -> Response:
        try:
            user = CustomUser.objects.get(id=uuid.UUID(request.data.get("user")))
            amount = Decimal(request.data.get("amount"))
            model = BasicSalary.objects.create(user=user, amount=amount)
            model.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_Calculate_Employee_Monthly_Salary(APIView):

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            _first_day = request.data.get("first_day")
            _last_day = request.data.get("last_day")
            user = CustomUser.objects.get(id=uuid.UUID(request.data.get("user")))
            # employee = Employee.objects.get(user=user)

            first_day = timezone.make_aware(
                datetime.strptime(f"{_first_day}", "%Y-%m-%d")
            )

            last_day = timezone.make_aware(
                datetime.strptime(f"{_last_day}", "%Y-%m-%d")
            )
            att = Attendance.objects.filter(
                user=user, check_in__range=(first_day, last_day)
            )

            business_day = pandas.bdate_range(first_day, last_day)
            list_business_days: list = [x.date() for x in business_day]

            check_in_days = []
            for x in att:
                check_in_days.append(x.check_in.date())

            exclude_days: list = []

            for x in list_business_days:
                if x in check_in_days:
                    continue
                else:
                    exclude_days.append(x)

            holidays = Holiday.objects.filter(date__range=(first_day, last_day))

            holiday_list = []  # total holidays in the month
            for x in holidays:
                holiday_list.append(x.date)

            holidays_in_workingdays = []  # total holidays that are in working days.
            leave_days = exclude_days.copy()
            for h in holiday_list:
                if h in exclude_days:
                    leave_days.remove(h)
                    holidays_in_workingdays.append(h)

            leaves_this_month = LeaveRequest.objects.filter(
                user=user,
                approved_time__isnull=False,
                from_date__range=(first_day, last_day),
            ).values(
                "leave_type__type",
                "leave_type__name",
                "leave_type__max_leaves",
                "duration",
            )

            df_current = pandas.DataFrame(leaves_this_month)

            # getting all types of leaves for the current month
            if not df_current.empty:
                aggregated_df_current = df_current.groupby(
                    ["leave_type__type", "leave_type__name", "leave_type__max_leaves"],
                    as_index=False,
                )["duration"].sum()
                current_month_leaves_records = aggregated_df_current.to_dict(
                    orient="records"
                )  # type: ignore
            else:
                current_month_leaves_records = []

            types_of_leaves_taken_this_month = [
                x["leave_type__name"] for x in current_month_leaves_records
            ]

            # For each leave type used this month, get overall approved leave usage (all months)
            if first_day.month < 4:
                from_year = timezone.now().year - 1
                to_year = timezone.now().year

            else:
                from_year = timezone.now().year
                to_year = timezone.now().year + 1

            from_datetime = timezone.make_aware(
                datetime.strptime(f"{from_year}-03-01", "%Y-%m-%d")
            )
            to_datetime = timezone.make_aware(
                datetime.combine(datetime(to_year, 3, 31), time.max)
            )

            total_usage_by_type = {}
            for leave_name in types_of_leaves_taken_this_month:
                overall_usage = (
                    LeaveRequest.objects.filter(
                        user=user,
                        approved_time__isnull=False,
                        leave_type__name=leave_name,
                        from_date__range=(from_datetime, to_datetime),
                    ).aggregate(total=Sum("duration"))["total"]
                    or 0
                )
                total_usage_by_type[leave_name] = overall_usage

            # For each leave type in the current month, calculate paid vs unpaid for the current usage.
            # We assume that `max_leaves` defined on the LeaveType model is the maximum paid leave allowance.
            # And overall usage includes current month usage.
            leave_payment_details = []
            for record in current_month_leaves_records:
                leave_name = record["leave_type__name"]
                current_usage = record["duration"]
                max_leaves = record["leave_type__max_leaves"]
                # Calculate previously approved usage (excluding current month's usage)
                overall_usage = total_usage_by_type.get(leave_name, 0)
                previous_usage = overall_usage - current_usage

                # Remaining paid leave days before applying current request
                remaining_paid_before_appling_current = max_leaves - previous_usage
                if remaining_paid_before_appling_current < 0:
                    remaining_paid_before_appling_current = 0

                # For the current request, determine how many days can be paid
                paid_current = min(remaining_paid_before_appling_current, current_usage)
                unpaid_current = current_usage - paid_current

                leave_payment_details.append(
                    {
                        "leave_type": leave_name,
                        "max_leaves": max_leaves,
                        "previous_usage": previous_usage,
                        "current_usage": current_usage,
                        "remaining_paid_before_appling_current_current": remaining_paid_before_appling_current,
                        "paid_current": paid_current,
                        "unpaid_current": unpaid_current,
                    }
                )

            total_unpaid_leaves_days_for_this_month = 0

            for x in leave_payment_details:
                total_unpaid_leaves_days_for_this_month += x["unpaid_current"]

            basic_salary = BasicSalary.objects.get(user=user).amount

            # total deduction for the unpaid leaves
            deduction = Decimal(
                (basic_salary / 30) * total_unpaid_leaves_days_for_this_month
            )
            bonus = Decimal(request.data.get("bonus") or 0)
            month_salary = basic_salary - deduction + bonus

            model = MonthlySalary.objects.create(
                user=user,
                deduction=deduction,
                bonus=bonus,
                amount=month_salary,
                for_month=request.data.get("for_month"),
            )
            model.save()

            return Response(month_salary)
        except Exception as e:
            print(traceback.format_exc())
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_View_AllEmployee_Monthly_Salary(APIView):
    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            now = timezone.now()
            first_day_of_month = timezone.make_aware(
                datetime(year=now.year, month=now.month, day=1)
            )
            for_month = request.data.get("for_month") or first_day_of_month

            monthly_salaries = MonthlySalary.objects.filter(for_month=str(for_month))
            return Response(monthly_salaries.values())
        except Exception as e:
            print(traceback.format_exc())
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
