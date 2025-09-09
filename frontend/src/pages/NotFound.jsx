import { TbError404 } from "react-icons/tb";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 text-center">
                <div className="mx-auto max-w-screen-sm">
                    <div className="text-yellow-400 mb-8 text-9xl flex justify-center">
                        <TbError404 />
                    </div>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-yellow-300 md:text-4xl">
                        Oops! Page not found.
                    </p>
                    <p className="mb-8 text-lg font-light text-gray-400">
                        Sorry, we can't find that page. You'll find lots to
                        explore on the home page.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex text-gray-900 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-6 py-3 text-center transition-colors duration-200"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
