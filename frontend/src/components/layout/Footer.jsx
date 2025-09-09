import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaInstagram,
    FaXTwitter,
    FaLinkedin,
} from "react-icons/fa6";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 py-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 min-h-28 flex lg:flex-row flex-col lg:gap-0 gap-8 justify-between items-center">
                <ul className="flex flex-1 md:gap-8 gap-6 text-gray-300 flex-row items-center">
                    <li>
                        <Link to="/about">
                            <span className="hover:text-yellow-400 transition-colors duration-200">
                                About Us
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <span className="hover:text-yellow-400 transition-colors duration-200">
                                Services
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact">
                            <span className="hover:text-yellow-400 transition-colors duration-200">
                                Contact
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <span className="hover:text-yellow-400 transition-colors duration-200">
                                Privacy Policy
                            </span>
                        </Link>
                    </li>
                </ul>

                <p className="w-fit flex items-center text-gray-300 text-sm">
                    <span>
                        &copy;{currentYear} NoteBunker | All rights reserved.
                    </span>
                </p>

                <div className="flex-1 flex flex-row gap-6 lg:justify-end justify-start items-center">
                    <Link
                        className="text-gray-300 h-10 w-10 flex justify-center items-center rounded-full p-2 hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200"
                        to="https://facebook.com"
                    >
                        <FaFacebook size={20} />
                    </Link>
                    <Link
                        className="text-gray-300 h-10 w-10 flex justify-center items-center rounded-full p-2 hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200"
                        to="https://linkedin.com"
                    >
                        <FaLinkedin size={20} />
                    </Link>
                    <Link
                        className="text-gray-300 h-10 w-10 flex justify-center items-center rounded-full p-2 hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200"
                        to="https://x.com"
                    >
                        <FaXTwitter size={20} />
                    </Link>
                    <Link
                        className="text-gray-300 h-10 w-10 flex justify-center items-center rounded-full p-2 hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200"
                        to="https://instagram.com"
                    >
                        <FaInstagram size={20} />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
