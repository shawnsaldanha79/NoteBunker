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
import { auditLogscolumn } from "../../utils/tableColumns";
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
                // fetchAuditLogs();
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
            toast.success("Note update successful");
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
        <div className="min-h-[calc(100vh-74px)] md:px-10 md:py-8 sm:px-6 py-4 px-4">
            <Buttons
                onClickhandler={onBackHandler}
                className="bg-btnColor px-4 py-2 rounded-md text-white hover:text-slate-200 mb-3"
            >
                Go Back
            </Buttons>
            <div className="py-6 px-8 min-h-customHeight shadow-lg shadow-gray-300 rounded-md bg-white">
                {!loading && (
                    <div className="flex justify-end py-2 gap-2">
                        {!editEnable ? (
                            <Buttons
                                onClickhandler={() =>
                                    setEditEnable(!editEnable)
                                }
                                className="bg-btnColor text-white px-3 py-1 rounded-md"
                            >
                                Edit
                            </Buttons>
                        ) : (
                            <Buttons
                                onClickhandler={() =>
                                    setEditEnable(!editEnable)
                                }
                                className="bg-customRed text-white px-3 py-1 rounded-md"
                            >
                                Cancel
                            </Buttons>
                        )}
                        {!editEnable && (
                            <Buttons
                                onClickhandler={() => setModalOpen(true)}
                                className="bg-customRed text-white px-3 py-1 rounded-md"
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
                            color="#4fa94d"
                            loading={true}
                        />
                        <span>Please wait...</span>
                    </div>
                ) : (
                    <>
                        {editEnable ? (
                            <div className="flex flex-col h-full">
                                <div className="flex-grow min-h-72 mb-4">
                                    <TipTapEditor
                                        content={editorContent}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200 mt-auto">
                                    <Buttons
                                        disabled={noteEditLoader}
                                        onClickhandler={onNoteEditHandler}
                                        className="bg-customRed text-white px-4 py-2 hover:text-slate-300 rounded-sm"
                                    >
                                        {noteEditLoader ? (
                                            <span>Loading...</span>
                                        ) : (
                                            " Update Note"
                                        )}
                                    </Buttons>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-slate-900 tipTap-content overflow-auto max-h-[calc(100vh-300px)]">
                                    {parse(editorContent || "")}
                                </div>

                                {isAdmin && (
                                    <div className="mt-10">
                                        <h1 className="text-2xl text-center text-slate-700 font-semibold uppercase pt-10 pb-4">
                                            Audit Logs
                                        </h1>

                                        <div className="overflow-x-auto">
                                            <DataGrid
                                                className="w-fit mx-auto"
                                                rows={rows}
                                                columns={auditLogscolumn}
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
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
            <Modals open={modalOpen} setOpen={setModalOpen} noteId={id} />
        </div>
    );
};

export default NoteDetails;