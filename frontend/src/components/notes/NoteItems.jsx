import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import parse from 'html-react-parser'
import { Link } from "react-router-dom";
import moment from "moment";

const NoteItems = ({ parsedContent, id, createdAt }) => {
  const formattedDate = moment(createdAt).format("D MMMM YYYY");
  return (
    <div className="sm:px-5 px-2 py-5 shadow-md bg-noteColor shadow-white rounded-lg min-h-96 max-h-96 relative flex flex-col">
      <div className="flex-grow overflow-hidden mb-12"> {/* Added margin-bottom for date row */}
        <div className="text-black font-customWeight tipTap-content h-full overflow-y-auto">
          {parse(parsedContent)}
        </div>
      </div>
      <div className="flex justify-between items-center absolute bottom-5 sm:px-5 px-2 left-0 w-full text-slate-700">
        <span className="text-sm">{formattedDate}</span>
        <Link to={`/notes/${id}`}>
          <Tooltip title="View Note">
            <IconButton>
              <MdRemoveRedEye className="text-slate-700" />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default NoteItems;