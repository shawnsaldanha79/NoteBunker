import { Link } from "react-router-dom";
import Buttons from "../../components/common/Buttons";
import Brands from "./Brands/Brands";
import Features from "./Features";
import Testimonial from "./Testimonial/Testimonials";
import { useMyContext } from "../../store/useMyContext";

const LandingPage = () => {
    const { token } = useMyContext();

    return (
        <div className="min-h-[calc(100vh-74px)] bg-gray-900 text-gray-100 flex justify-center">
            <div className="lg:w-[80%] w-full py-16 space-y-4">
                <div className="uppercase text-yellow-400 xl:text-6xl md:text-4xl text-2xl mx-auto text-center font-bold sm:w-[95%] w-full">
                    Turn your thoughts into secure, organized notes
                </div>
                <h3 className="text-yellow-300 md:text-2xl text-xl font-semibold text-center">
                    The #1 secure note-taking app.
                </h3>
                <p className="text-gray-300 text-center sm:w-[80%] w-[90%] mx-auto">
                    Manage your notes effortlessly and securely. Just type,
                    save, and access them from anywhere with robust encryption
                    and seamless synchronization.
                </p>
                <div className="flex items-center justify-center gap-4 py-10">
                    {token ? (
                        <>
                            <Link to="/create-note">
                                <Buttons className="w-48 bg-yellow-500 hover:bg-yellow-600 font-semibold transition-all duration-200 cursor-pointer text-gray-900 px-6 py-3 rounded-lg">
                                    Create Note
                                </Buttons>
                            </Link>
                            <Link to="/notes">
                                <Buttons className="w-48 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 font-semibold transition-all duration-200 cursor-pointer px-6 py-3 rounded-lg">
                                    My Notes
                                </Buttons>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Buttons className="w-48 bg-yellow-500 hover:bg-yellow-600 font-semibold transition-all duration-200 cursor-pointer text-gray-900 px-6 py-3 rounded-lg">
                                    Sign In
                                </Buttons>
                            </Link>
                            <Link to="/signup">
                                <Buttons className="w-48 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 font-semibold transition-all duration-200 cursor-pointer px-6 py-3 rounded-lg">
                                    Sign Up
                                </Buttons>
                            </Link>
                        </>
                    )}
                </div>
                <div className="sm:pt-14 pt-0 xl:px-16 md:px-10">
                    <h1 className="uppercase text-yellow-400 xl:text-4xl md:text-3xl text-2xl mx-auto text-center font-bold w-full mb-16">
                        Trusted by professionals worldwide
                    </h1>
                    <Brands />
                    <Features />
                    <div className="pb-10">
                        <h1 className="uppercase text-yellow-400 pb-16 xl:text-4xl md:text-3xl text-2xl mx-auto text-center font-bold sm:w-[95%] w-full">
                            What Our Users Say
                        </h1>
                        <Testimonial />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
