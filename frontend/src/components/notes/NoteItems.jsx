import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import parse from 'html-react-parser'
import { Link } from "react-router-dom";
import moment from "moment";

const NoteItems = ({ parsedContent, id, createdAt }) => {
  const formattedDate = moment(createdAt).format("D MMMM YYYY");
  return (
    <div className="sm:px-5 px-2 py-5 shadow-md bg-noteColor shadow-white rounded-lg min-h-96 max-h-96 relative overflow-hidden">
      <div
        className="text-black font-customWeight tipTap-content"
      >{parse(parsedContent)}</div>
      <div className="flex justify-between items-center absolute bottom-5 sm:px-5 px-2 left-0 w-full text-slate-700">
        <span>{formattedDate}</span>
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