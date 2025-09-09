import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { BeatLoader } from "react-spinners";
import Errors from "../../components/common/Errors";
import moment from "moment";
import { noteAuditLogColumns } from "../../utils/tableColumns";

const AuditLogsDetails = () => {
    const { noteId } = useParams();
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSingleAuditLogs = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/audit/note/${noteId}`);
            setAuditLogs(data);
        } catch (err) {
            setError(err?.response?.data?.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [noteId]);

    useEffect(() => {
        if (noteId) {
            fetchSingleAuditLogs();
        }
    }, [noteId, fetchSingleAuditLogs]);

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
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="py-6">
                {auditLogs.length > 0 && (
                    <h1 className="text-center sm:text-2xl text-lg font-bold text-yellow-400">
                        Audit Log for Note ID - {noteId}
                    </h1>
                )}
            </div>
            {loading ? (
                <div className="flex flex-col justify-center items-center h-72">
                    <BeatLoader
                        height="70"
                        width="70"
                        color="#fbbf24"
                        loading={true}
                    />
                    <span className="text-gray-300 mt-4">
                        Loading audit details...
                    </span>
                </div>
            ) : auditLogs.length === 0 ? (
                <Errors message="Invalid NoteId" />
            ) : (
                <div className="overflow-x-auto w-full bg-gray-800 rounded-2xl p-4">
                    <DataGrid
                        className="w-full"
                        rows={rows}
                        columns={noteAuditLogColumns}
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
                        sx={{
                            color: "#e5e7eb",
                            "& .MuiDataGrid-cell": {
                                borderColor: "#4b5563",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#374151",
                                color: "#fbbf24",
                                fontSize: "1rem",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: "#374151",
                                color: "#e5e7eb",
                            },
                            "& .MuiTablePagination-root": {
                                color: "#e5e7eb",
                            },
                            "& .MuiIconButton-root": {
                                color: "#e5e7eb",
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default AuditLogsDetails;
