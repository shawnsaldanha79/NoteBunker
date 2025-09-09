const BrandItem = ({ text, icon: Icon, title }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4 justify-center hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
            <Icon className="text-yellow-400 text-4xl" />
            <h3 className="text-xl text-yellow-300 font-bold">{title}</h3>
            <p className="text-gray-300 text-center">{text}</p>
        </div>
    );
};

export default BrandItem;
