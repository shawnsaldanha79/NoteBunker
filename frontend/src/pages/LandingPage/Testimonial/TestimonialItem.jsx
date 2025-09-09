import Avatar from "@mui/material/Avatar";

const TestimonialItem = ({ title, text, name, status, imgurl }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
            <h1 className="text-yellow-300 text-xl font-bold pb-4">{title}</h1>

            <p className="text-gray-300 text-sm leading-relaxed">{text}</p>

            <div className="pt-5 flex gap-3 items-center mt-auto">
                <Avatar alt={name} src={imgurl} />
                <div className="flex flex-col">
                    <span className="font-semibold text-yellow-300">
                        {name}
                    </span>
                    <span className="text-gray-400 text-sm">{status}</span>
                </div>
            </div>
        </div>
    );
};

export default TestimonialItem;
