import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaInstagram,
    FaXTwitter,
    FaLinkedin,
} from "react-icons/fa6";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-6">
                        About NoteBunker
                    </h1>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-lg mb-12">
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                        Welcome to{" "}
                        <span className="text-yellow-400 font-semibold">
                            NoteBunker
                        </span>
                        , your trusted companion for secure and private
                        note-taking. We believe in providing a safe space where
                        your thoughts and ideas are protected with the highest
                        level of security.
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Our mission is to ensure that your notes are always
                        accessible to you and only you. With state-of-the-art
                        encryption and user-friendly features, NoteBunker is
                        designed to keep your information confidential and
                        secure.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-yellow-300 mb-6">
                        Key Features
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <span className="text-yellow-400 text-xl mr-3">
                                •
                            </span>
                            <span className="text-gray-300">
                                Military-grade encryption for all your notes
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-400 text-xl mr-3">
                                •
                            </span>
                            <span className="text-gray-300">
                                Two-factor authentication for enhanced security
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-400 text-xl mr-3">
                                •
                            </span>
                            <span className="text-gray-300">
                                Cross-platform accessibility with real-time sync
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-400 text-xl mr-3">
                                •
                            </span>
                            <span className="text-gray-300">
                                Intuitive and user-friendly interface
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="text-center mt-12">
                    <h3 className="text-xl text-yellow-300 mb-6">
                        Connect With Us
                    </h3>
                    <div className="flex justify-center space-x-6">
                        <Link
                            to="https://www.facebook.com"
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                        >
                            <FaFacebook size={24} />
                        </Link>
                        <Link
                            to="https://www.linkedin.com"
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                        >
                            <FaLinkedin size={24} />
                        </Link>
                        <Link
                            to="https://x.com"
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                        >
                            <FaXTwitter size={24} />
                        </Link>
                        <Link
                            to="https://www.instagram.com"
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                        >
                            <FaInstagram size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
