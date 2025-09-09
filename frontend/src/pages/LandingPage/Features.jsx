import { MdDevices } from "react-icons/md";
import { FaBoltLightning } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";

const State = () => {
    return (
        <div className="py-20">
            <div className="flex justify-between items-center md:px-0 px-4 mb-16">
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <span className="sm:text-5xl text-4xl text-yellow-400 font-bold">
                        10K+
                    </span>
                    <span className="text-gray-300 text-center sm:text-sm text-xs">
                        Active Users
                    </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <span className="sm:text-5xl text-4xl text-yellow-400 font-bold">
                        99.9%
                    </span>
                    <span className="text-gray-300 text-center sm:text-sm text-xs">
                        Uptime Guarantee
                    </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <span className="sm:text-5xl text-4xl text-yellow-400 font-bold">
                        256-bit
                    </span>
                    <span className="text-gray-300 text-center sm:text-sm text-xs">
                        Encryption
                    </span>
                </div>
            </div>

            <div className="mt-16">
                <h3 className="text-yellow-300 text-2xl font-semibold pb-8 text-center">
                    Why Choose NoteBunker
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-8 px-4">
                    <div className="bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaLock className="text-yellow-400 text-xl" />
                        </div>
                        <h4 className="text-yellow-300 font-semibold mb-2">
                            Bank-Level Security
                        </h4>
                        <p className="text-gray-300 text-sm">
                            End-to-end encryption keeps your notes completely
                            private and secure
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBoltLightning className="text-yellow-400 text-xl" />
                        </div>
                        <h4 className="text-yellow-300 font-semibold mb-2">
                            Lightning Fast
                        </h4>
                        <p className="text-gray-300 text-sm">
                            Instant search across thousands of notes with
                            optimized performance
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdDevices className="text-yellow-400 text-xl" />
                        </div>
                        <h4 className="text-yellow-300 font-semibold mb-2">
                            Cross-Platform
                        </h4>
                        <p className="text-gray-300 text-sm">
                            Access your notes from any device, anywhere, anytime{" "}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default State;
