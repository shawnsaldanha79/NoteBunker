const ContactPage = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-74px)] bg-gray-900 py-12 px-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center border border-gray-700">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                        Contact Us
                    </h1>
                    <div className="w-16 h-1 bg-yellow-500 mx-auto"></div>
                </div>
                <p className="text-gray-300 mb-6">
                    We'd love to hear from you! If you have any questions or
                    feedback, feel free to reach out to us.
                </p>
                <form onSubmit={onSubmitHandler} className="space-y-5">
                    <div>
                        <label
                            className="block text-left text-yellow-300 mb-2 font-medium"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-100 placeholder-gray-400"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-left text-yellow-300 mb-2 font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-100 placeholder-gray-400"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-left text-yellow-300 mb-2 font-medium"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-100 placeholder-gray-400"
                            placeholder="Your message..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
