import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import moment from "moment";

const NoteItems = ({ parsedContent, id, createdAt }) => {
    const formattedDate = moment(createdAt).format("D MMMM YYYY");
    return (
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 min-h-96 max-h-96 flex flex-col group">
            <div className="flex-grow overflow-hidden mb-4">
                <div className="text-gray-100 font-normal tipTap-content h-full overflow-y-auto">
                    {parse(parsedContent)}
                </div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                <span className="text-sm text-gray-400">{formattedDate}</span>
                <Link to={`/notes/${id}`}>
                    <Tooltip title="View Note" arrow>
                        <IconButton className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 transition-colors duration-200">
                            <MdRemoveRedEye className="text-current" />
                        </IconButton>
                    </Tooltip>
                </Link>
            </div>
        </div>
    );
};

export default NoteItems;
