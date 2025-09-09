import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/common/Buttons";

const AccessDenied = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center items-center">
                    <div className="text-yellow-500 mb-6 text-7xl tracking-tight font-extrabold lg:text-9xl flex justify-center">
                        <FaExclamationTriangle />
                    </div>
                    <h1 className="mb-4 text-3xl tracking-tight font-bold text-yellow-300 md:text-4xl">
                        Access Denied
                    </h1>
                    <p className="mb-6 text-lg font-light text-gray-400">
                        You do not have permission to view this page.
                    </p>
                    <Buttons
                        onClickhandler={goHome}
                        className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                    >
                        Back to Homepage
                    </Buttons>
                </div>
            </div>
        </section>
    );
};

export default AccessDenied;
