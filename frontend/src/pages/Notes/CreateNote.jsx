import { useState } from "react";
import { MdNoteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Buttons from "../../components/common/Buttons";
import toast from "react-hot-toast";
import TipTapEditor from "../../components/common/TipTapEditor";

const CreateNote = () => {
    const navigate = useNavigate();
    const [editorContent, setEditorContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (content) => {
        setEditorContent(content);
    };

    const handleSubmit = async () => {
        if (editorContent.trim().length === 0) {
            return toast.error("Note content is required");
        }
        try {
            setLoading(true);
            const noteData = { content: editorContent };
            await api.post("/notes", noteData);
            toast.success("Note created successfully");
            navigate("/notes");
        } catch (error) {
            toast.error("Error creating note");
            console.error("Error creating note", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-74px)] bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 pb-8">
                    <MdNoteAlt className="text-yellow-400 text-4xl" />
                    <h1 className="text-yellow-400 text-3xl font-bold">
                        Create New Note
                    </h1>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
                    <div className="h-96 mb-6">
                        <TipTapEditor
                            content={editorContent}
                            onChange={handleChange}
                        />
                    </div>

                    <Buttons
                        disabled={loading}
                        onClickhandler={handleSubmit}
                        className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                Creating...
                            </span>
                        ) : (
                            "Create Note"
                        )}
                    </Buttons>
                </div>
            </div>
        </div>
    );
};

export default CreateNote;
