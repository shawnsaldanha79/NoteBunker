import { useEffect, useState } from "react";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import Errors from "../../components/common/Errors";
import moment from "moment";
import { userListColumns } from "../../utils/tableColumns";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {
            try {
                const response = await api.get("/admin/getusers");
                const usersData = Array.isArray(response.data)
                    ? response.data
                    : [];
                setUsers(usersData);
            } catch (err) {
                setError(err?.response?.data?.message);
                toast.error("Error fetching users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const rows = users.map((item) => {
        const formattedDate = moment(item.createdDate).format(
            "MMMM DD, YYYY, hh:mm A"
        );

        return {
            id: item.userId,
            username: item.userName,
            email: item.email,
            created: formattedDate,
            status: item.enabled ? "Active" : "Inactive",
        };
    });

    if (error) {
        return <Errors message={error} />;
    }

    return (
        <div className="p-4">
            <div className="py-4">
                <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
                    All Users
                </h1>
            </div>
            <div className="overflow-x-auto w-full mx-auto">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-72">
                        <BeatLoader
                            height="70"
                            width="70"
                            color="#4fa94d"
                            loading={true}
                        />
                        <span>Please wait...</span>
                    </div>
                ) : (
                    <DataGrid
                        className="w-fit mx-auto"
                        rows={rows}
                        columns={userListColumns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 6,
                                },
                            },
                        }}
                        disableRowSelectionOnClick
                        pageSizeOptions={[6]}
                        disableColumnResize
                    />
                )}
            </div>
        </div>
    );
};

export default UserList;
