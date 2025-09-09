import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import Buttons from "../../components/common/Buttons";
import Errors from "../../components/common/Errors";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import Modals from "../../components/common/PopModal";
import { noteAuditLogColumns } from "../../utils/tableColumns";
import TipTapEditor from "../../components/common/TipTapEditor";

const NoteDetails = () => {
    const { id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [note, setNote] = useState(null);
    const [editorContent, setEditorContent] = useState("");
    const [auditLogs, setAuditLogs] = useState([]);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [noteEditLoader, setNoteEditLoader] = useState(false);
    const [editEnable, setEditEnable] = useState(false);
    const navigate = useNavigate();
    const fetchNoteDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/notes");
            const foundNote = response.data.find((n) => n.id.toString() === id);
            if (foundNote) {
                let content;
                try {
                    const parsedContent = JSON.parse(foundNote.content);
                    content = parsedContent.content || foundNote.content;
                } catch {
                    content = foundNote.content;
                }
                setNote(foundNote);
                setEditorContent(content);
            } else {
                setError("Invalid Note");
            }
        } catch (err) {
            setError(err?.response?.data?.message);
            console.error("Error fetching note details", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const checkAdminRole = async () => {
        try {
            const response = await api.get("/auth/user");
            const roles = response.data.roles;
            if (roles.includes("ROLE_ADMIN")) {
                setIsAdmin(true);
            }
        } catch (err) {
            console.error("Error checking admin role", err);
            setError("Error checking admin role", err);
        }
    };

    const fetchAuditLogs = useCallback(async () => {
        try {
            const response = await api.get(`/audit/note/${id}`);
            setAuditLogs(response.data);
        } catch (err) {
            console.error("Error fetching audit logs", err);
            setError("Error fetching audit logs", err);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchNoteDetails();
            checkAdminRole();
            if (isAdmin) {
                fetchAuditLogs();
            }
        }
    }, [id, isAdmin, fetchAuditLogs, fetchNoteDetails]);

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

    const handleChange = (content) => {
        setEditorContent(content);
    };

    const onNoteEditHandler = async () => {
        if (editorContent.trim().length === 0) {
            return toast.error("Note content Shouldn't be empty");
        }

        try {
            setNoteEditLoader(true);
            const noteData = { content: editorContent };
            await api.put(`/notes/${id}`, noteData);
            toast.success("Note updated successfully");
            setEditEnable(false);
            fetchNoteDetails();
            checkAdminRole();
            if (isAdmin) {
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error("Update Note Failed");
            console.error(error);
        } finally {
            setNoteEditLoader(false);
        }
    };

    const onBackHandler = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-[calc(100vh-74px)] bg-gray-900 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <Buttons
                    onClickhandler={onBackHandler}
                    className="bg-gray-700 text-yellow-400 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 mb-4"
                >
                    ← Go Back
                </Buttons>

                <div className="bg-gray-800 rounded-2xl shadow-2xl p-6">
                    {!loading && (
                        <div className="flex justify-end py-2 gap-3 mb-4">
                            {!editEnable ? (
                                <Buttons
                                    onClickhandler={() =>
                                        setEditEnable(!editEnable)
                                    }
                                    className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                                >
                                    Edit
                                </Buttons>
                            ) : (
                                <Buttons
                                    onClickhandler={() =>
                                        setEditEnable(!editEnable)
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                                >
                                    Cancel
                                </Buttons>
                            )}
                            {!editEnable && (
                                <Buttons
                                    onClickhandler={() => setModalOpen(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                                >
                                    Delete
                                </Buttons>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-96">
                            <BeatLoader
                                height="70"
                                width="70"
                                color="#fbbf24"
                                loading={true}
                            />
                            <span className="text-gray-300 mt-4">
                                Loading note...
                            </span>
                        </div>
                    ) : (
                        <>
                            {editEnable ? (
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow min-h-96 mb-6">
                                        <TipTapEditor
                                            content={editorContent}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="sticky bottom-0 bg-gray-800 py-4 border-t border-gray-700">
                                        <Buttons
                                            disabled={noteEditLoader}
                                            onClickhandler={onNoteEditHandler}
                                            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {noteEditLoader ? (
                                                <span className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                                    Updating...
                                                </span>
                                            ) : (
                                                "Update Note"
                                            )}
                                        </Buttons>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-gray-100 tipTap-content overflow-auto max-h-[calc(100vh-300px)] bg-gray-700 rounded-lg p-6">
                                        {parse(editorContent || "")}
                                    </div>

                                    {isAdmin && (
                                        <div className="mt-10">
                                            <h1 className="text-2xl text-yellow-400 font-bold text-center mb-6">
                                                Audit Logs
                                            </h1>

                                            <div className="bg-gray-700 rounded-lg p-4">
                                                <DataGrid
                                                    className="bg-gray-800 text-gray-100 border-gray-600"
                                                    rows={rows}
                                                    columns={
                                                        noteAuditLogColumns
                                                    }
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
                                                    sx={{
                                                        color: "#e5e7eb",
                                                        "& .MuiDataGrid-cell": {
                                                            borderColor:
                                                                "#4b5563",
                                                        },
                                                        "& .MuiDataGrid-columnHeaders":
                                                            {
                                                                backgroundColor:
                                                                    "#374151",
                                                                color: "#fbbf24",
                                                            },
                                                        "& .MuiDataGrid-footerContainer":
                                                            {
                                                                backgroundColor:
                                                                    "#374151",
                                                                color: "#e5e7eb",
                                                            },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
                <Modals open={modalOpen} setOpen={setModalOpen} noteId={id} />
            </div>
        </div>
    );
};

export default NoteDetails;
