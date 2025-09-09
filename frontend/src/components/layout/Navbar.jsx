import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useMyContext } from "../../store/useMyContext";

const Navbar = () => {
    const [headerToggle, setHeaderToggle] = useState(false);
    const pathName = useLocation().pathname;
    const navigate = useNavigate();

    const { token, setToken, setCurrentUser, isAdminUser, setIsAdminUser } =
        useMyContext();
    const handleLogout = () => {
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("USER");
        localStorage.removeItem("CSRF_TOKEN");
        localStorage.removeItem("IS_ADMIN");
        setToken(null);
        setCurrentUser(null);
        setIsAdminUser(false);
        navigate("/login");
    };

    return (
        <header className="h-16 z-50 text-gray-100 bg-gray-900 shadow-lg border-b border-gray-800 flex items-center sticky top-0">
            <nav className="sm:px-8 px-4 flex w-full h-full items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <h3 className="text-yellow-400 text-xl font-bold">
                        NoteBunker
                    </h3>
                </Link>
                <ul
                    className={`lg:static absolute left-0 top-16 w-full lg:w-fit lg:px-0 sm:px-8 px-4 lg:bg-transparent bg-gray-900 ${
                        headerToggle
                            ? "min-h-fit max-h-96 lg:py-0 py-4 shadow-lg lg:shadow-none border-b border-gray-800"
                            : "h-0 overflow-hidden"
                    } lg:h-auto transition-all duration-200 text-gray-100 flex lg:flex-row flex-col lg:gap-6 gap-3`}
                >
                    {token && (
                        <>
                            <Link to="/notes">
                                <li
                                    className={`${
                                        pathName === "/notes"
                                            ? "text-yellow-400 font-semibold"
                                            : "text-gray-300"
                                    } py-2 cursor-pointer hover:text-yellow-400 transition-colors duration-200`}
                                >
                                    My Notes
                                </li>
                            </Link>
                            <Link to="/create-note">
                                <li
                                    className={`py-2 cursor-pointer hover:text-yellow-400 transition-colors duration-200 ${
                                        pathName === "/create-note"
                                            ? "text-yellow-400 font-semibold"
                                            : "text-gray-300"
                                    }`}
                                >
                                    Create Note
                                </li>
                            </Link>
                        </>
                    )}

                    <Link to="/contact">
                        <li
                            className={`${
                                pathName === "/contact"
                                    ? "text-yellow-400 font-semibold"
                                    : "text-gray-300"
                            } py-2 cursor-pointer hover:text-yellow-400 transition-colors duration-200`}
                        >
                            Contact
                        </li>
                    </Link>

                    <Link to="/about">
                        <li
                            className={`py-2 cursor-pointer hover:text-yellow-400 transition-colors duration-200 ${
                                pathName === "/about"
                                    ? "text-yellow-400 font-semibold"
                                    : "text-gray-300"
                            }`}
                        >
                            About
                        </li>
                    </Link>

                    {token ? (
                        <>
                            <Link to="/profile">
                                <li
                                    className={`py-2 cursor-pointer hover:text-yellow-400 transition-colors duration-200 ${
                                        pathName === "/profile"
                                            ? "text-yellow-400 font-semibold"
                                            : "text-gray-300"
                                    }`}
                                >
                                    Profile
                                </li>
                            </Link>
                            {isAdminUser && (
                                <Link to="/admin/users">
                                    <li
                                        className={`py-2 cursor-pointer uppercase hover:text-yellow-400 transition-colors duration-200 ${
                                            pathName.startsWith("/admin")
                                                ? "text-yellow-400 font-semibold"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        Admin
                                    </li>
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-24 text-center bg-red-600 font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors duration-200"
                            >
                                LogOut
                            </button>
                        </>
                    ) : (
                        <Link to="/signup">
                            <li className="w-24 text-center bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors duration-200">
                                SignUp
                            </li>
                        </Link>
                    )}
                </ul>
                <span
                    onClick={() => setHeaderToggle(!headerToggle)}
                    className="lg:hidden block cursor-pointer text-gray-100 hover:text-yellow-400 transition-colors duration-200"
                >
                    {headerToggle ? (
                        <RxCross2 className="text-2xl" />
                    ) : (
                        <IoMenu className="text-2xl" />
                    )}
                </span>
            </nav>
        </header>
    );
};

export default Navbar;
