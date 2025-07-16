import {useState} from "react";
import api from "../../../config/api";
import URLS from "../../../utils/urls";
// import { toast } from "react-hot-toast";

export default function AddSalaryModal({getEmployee, setToast, refreshData}) {
    const [user_id, setUser_id] = useState(getEmployee[0].uuid);
    const [salaryAmt, setSalaryAmt] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(URLS.baseSalaryList, {user: user_id, amount: parseFloat(salaryAmt)});
            if (res.status === 201) {
                document.getElementById("my_modal_5").close();
                refreshData();
                setToast("Salary Added Successfully.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box w-full max-w-2xl">
                <h3 className="font-bold text-xl mb-4">Add Salary</h3>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <select className="p-2 outline-zinc-700 rounded-lg"
                            onChange={(e) => {
                                console.log("Selected Value", e.target.value)
                                setUser_id(e.target.value)
                            }}
                            value={user_id}
                    >
                        {getEmployee.map((employee) =>
                            (
                                <option
                                    key={employee.uuid}
                                    value={employee.uuid}
                                    className="p-2 outline-zinc-700 rounded-lg"
                                >
                                    {employee.name}
                                </option>)
                        )}
                    </select>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        className="p-2 rounded-lg"
                        onChange={e => setSalaryAmt(parseInt(e.target.value))}
                    />

                    {/* Action Buttons */}
                    <div className="modal-action md:col-span-2 flex justify-end mt-4 gap-2">
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() =>
                                document.getElementById("my_modal_5").close()
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
