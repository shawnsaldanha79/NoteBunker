import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import NoteItems from "../../components/notes/NoteItems";
import { FiFilePlus } from "react-icons/fi";
import { BeatLoader } from "react-spinners";
import Errors from "../../components/common/Errors";

const AllNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await api.get("/notes");

            const parsedNotes = response.data.map((note) => ({
                ...note,
                parsedContent: JSON.parse(note.content).content,
            }));
            setNotes(parsedNotes);
        } catch (error) {
            setError(error.response.data.message);
            console.error("Error fetching notes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    if (error) {
        return <Errors message={error} />;
    }

    return (
        <div className="min-h-[calc(100vh-74px)] bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {!loading && notes && notes?.length > 0 && (
                    <h1 className="text-yellow-400 text-3xl font-bold mb-8">
                        My Notes
                    </h1>
                )}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-72">
                        <BeatLoader
                            height="70"
                            width="70"
                            color="#fbbf24"
                            loading={true}
                        />
                        <span className="text-gray-300 mt-4">
                            Loading your notes...
                        </span>
                    </div>
                ) : (
                    <>
                        {notes && notes?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-96 p-4 text-center">
                                <div className="bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md">
                                    <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                                        No notes yet
                                    </h2>
                                    <p className="text-gray-300 mb-6">
                                        Start by creating your first secure note
                                        to keep track of your thoughts and
                                        ideas.
                                    </p>
                                    <div className="w-full flex justify-center">
                                        <Link to="/create-note">
                                            <button className="flex items-center px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200">
                                                <FiFilePlus
                                                    className="mr-2"
                                                    size={24}
                                                />
                                                Create New Note
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                                {notes.map((item) => (
                                    <NoteItems
                                        key={item.id}
                                        {...item}
                                        id={item.id}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllNotes;
