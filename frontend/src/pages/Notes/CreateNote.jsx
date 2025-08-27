// CreateNote.jsx (updated)
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
            toast.success("Note create successful");
            navigate("/notes");
        } catch (error) {
            toast.error("Error creating note");
            console.error("Error creating note", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-74px)] p-10">
            <div className="flex items-center gap-1 pb-5">
                <h1 className="font-montserrat text-slate-800 sm:text-4xl text-2xl font-semibold">
                    Create New Note
                </h1>
                <MdNoteAlt className="text-slate-700 text-4xl" />
            </div>

            <div className="h-72 sm:mb-20 lg:mb-14 mb-28">
                <TipTapEditor content={editorContent} onChange={handleChange} />
            </div>

            <Buttons
                disabled={loading}
                onClickhandler={handleSubmit}
                className="bg-customRed text-white px-4 py-2 hover:text-slate-300 rounded-sm"
            >
                {loading ? <span>Loading...</span> : " Create Note"}
            </Buttons>
        </div>
    );
};

export default CreateNote;
