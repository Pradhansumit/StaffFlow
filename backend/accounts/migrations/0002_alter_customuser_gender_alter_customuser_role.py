# Generated by Django 5.1.7 on 2025-04-09 05:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='gender',
            field=models.IntegerField(choices=[(0, 'Male'), (1, 'Female')], default=0),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.IntegerField(choices=[(0, 'Employee'), (1, 'Admin')], default=0),
        ),
    ]
