import { useEffect, useState } from "react";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import Errors from "../../components/common/Errors";
import moment from "moment";
import { adminAuditLogColumns } from "../../utils/tableColumns";

const AdminAuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAuditLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get("/audit");
            setAuditLogs(response.data);
        } catch (err) {
            setError(err?.response?.data?.message);
            toast.error("Error fetching audit logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const rows = auditLogs.map((item) => {
        const formattedDate = moment(item.timestamp).format(
            "MMMM DD, YYYY, hh:mm A"
        );

        return {
            id: item.id,
            noteId: item.noteId,
            actions: item.action,
            username: item.username,
            timestamp: formattedDate,
            noteid: item.noteId,
            note: item.noteContent,
        };
    });

    if (error) {
        return <Errors message={error} />;
    }

    return (
        <div className="p-4">
            <div className="py-4">
                <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
                    Audit Logs
                </h1>
            </div>
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
                <div className="overflow-x-auto w-full mx-auto">
                    <DataGrid
                        className="w-fit mx-auto px-0"
                        rows={rows}
                        columns={adminAuditLogColumns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 6,
                                },
                            },
                        }}
                        pageSizeOptions={[6]}
                        disableRowSelectionOnClick
                        disableColumnResize
                    />
                </div>
            )}
        </div>
    );
};

export default AdminAuditLogs;
