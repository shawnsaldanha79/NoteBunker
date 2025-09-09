import { AiOutlineWarning } from "react-icons/ai";
import Modal from "@mui/material/Modal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useState } from "react";

const Modals = ({ open, setOpen, noteId }) => {
    const navigate = useNavigate();
    const [noteDeleteLoader, setNoteDeleteLoader] = useState(false);

    const onNoteDeleteHandler = async () => {
        try {
            setNoteDeleteLoader(true);

            await api.delete(`/notes/${noteId}`);
            toast.success("Note deleted successfully");
            setOpen(false);
            navigate("/notes");
        } catch (error) {
            toast.error("Failed to delete note");
            console.error("Error deleting note", error);
        } finally {
            setNoteDeleteLoader(false);
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="flex justify-center items-center h-full">
                    <div className="w-96 bg-gray-800 rounded-2xl shadow-xl max-w-md px-6 py-8 m-4 border border-gray-700">
                        <div className="flex flex-col items-center justify-center mb-4">
                            <AiOutlineWarning className="text-yellow-400 text-4xl" />
                        </div>
                        <p className="mt-4 text-gray-200 text-center text-lg">
                            Are you sure you want to delete this note?
                        </p>
                        <p className="text-gray-400 text-center text-sm mt-2">
                            This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onNoteDeleteHandler}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                disabled={noteDeleteLoader}
                            >
                                {noteDeleteLoader ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Modals;
