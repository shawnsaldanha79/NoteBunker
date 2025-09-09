import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Errors = ({ message }) => {
    const navigate = useNavigate();
    const onBackHandler = () => {
        navigate(-1);
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-gray-900">
            <div className="text-center bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md">
                <div className="flex justify-center">
                    <FiAlertCircle className="text-yellow-400 mb-4" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                    Oops! Something went wrong.
                </h2>
                <p className="text-gray-300 mb-6 font-semibold">{message}</p>
                <div className="flex justify-center">
                    <button
                        onClick={onBackHandler}
                        className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Errors;
