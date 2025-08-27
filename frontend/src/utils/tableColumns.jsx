import { MdDateRange, MdOutlineEmail } from "react-icons/md";
import { auditLogsTruncateTexts } from "./truncateText";
import { Link } from "react-router-dom";

const commonColumnStyles = {
    headerClassName: "text-black font-semibold",
    cellClassName: "text-slate-700 font-normal",
    headerAlign: "center",
    align: "center",
    editable: false,
    disableColumnMenu: true,
};

export const adminAuditLogColumns = [
    {
        field: "actions",
        headerName: "Action",
        width: 160,
        ...commonColumnStyles,
        renderHeader: () => <span>Action</span>,
    },
    {
        field: "username",
        headerName: "Username",
        width: 180,
        ...commonColumnStyles,
        renderHeader: () => <span>Username</span>,
    },
    {
        field: "timestamp",
        headerName: "Timestamp",
        width: 220,
        ...commonColumnStyles,
        renderHeader: () => <span>Timestamp</span>,
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <MdDateRange className="text-slate-700 text-lg" />
                <span>{params?.row?.timestamp}</span>
            </div>
        ),
    },
    {
        field: "noteid",
        headerName: "NoteId",
        width: 150,
        ...commonColumnStyles,
        renderHeader: () => <span>NoteId</span>,
    },
    {
        field: "note",
        headerName: "Note Content",
        width: 220,
        ...commonColumnStyles,
        renderHeader: () => <span>Note Content</span>,
        renderCell: (params) => {
            const contents = JSON.parse(params?.value)?.content;
            const response = auditLogsTruncateTexts(contents);
            return <p className="text-slate-700 text-center">{response}</p>;
        },
    },
    {
        field: "action",
        headerName: "Action",
        width: 150,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold",
        cellClassName: "text-slate-700 font-normal",
        sortable: false,
        renderHeader: () => <span>Action</span>,
        renderCell: (params) => (
            <Link
                to={`/admin/audit-logs/${params.row.noteId}`}
                className="h-full flex justify-center items-center"
            >
                <button className="bg-btnColor text-white px-4 flex justify-center items-center h-9 rounded-md">
                    Views
                </button>
            </Link>
        ),
    },
];

export const noteAuditLogColumns = [
    {
        field: "actions",
        headerName: "Action",
        width: 160,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold",
        cellClassName: "text-slate-700 font-normal",
        renderHeader: () => <span className="ps-10">Action</span>,
    },
    {
        field: "username",
        headerName: "Username",
        width: 200,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold",
        cellClassName: "text-slate-700 font-normal",
        renderHeader: () => <span className="ps-10">Username</span>,
    },
    {
        field: "timestamp",
        headerName: "Timestamp",
        width: 220,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold",
        cellClassName: "text-slate-700 font-normal",
        renderHeader: () => <span className="ps-10">Timestamp</span>,
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <MdDateRange className="text-slate-700 text-lg" />
                <span>{params?.row?.timestamp}</span>
            </div>
        ),
    },
    {
        field: "noteid",
        headerName: "NoteId",
        width: 150,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold",
        cellClassName: "text-slate-700 font-normal",
        renderHeader: () => <span>NoteId</span>,
    },
    {
        field: "note",
        headerName: "Note Content",
        width: 350,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold",
        cellClassName: "text-slate-700 font-normal",
        renderHeader: () => <span className="ps-10">Note Content</span>,
        renderCell: (params) => {
            const contents = JSON.parse(params?.value)?.content;
            const response = auditLogsTruncateTexts(contents, 50);
            return <p className="text-slate-700 text-center">{response}</p>;
        },
    },
];

export const userListColumns = [
    {
        field: "username",
        headerName: "Username",
        minWidth: 200,
        ...commonColumnStyles,
        renderHeader: () => <span className="text-center">Username</span>,
    },
    {
        field: "email",
        headerName: "Email",
        width: 260,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold text-center",
        cellClassName: "text-slate-700 font-normal text-center",
        renderHeader: () => <span>Email</span>,
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <MdOutlineEmail className="text-slate-700 text-lg" />
                <span>{params?.row?.email}</span>
            </div>
        ),
    },
    {
        field: "created",
        headerName: "Created At",
        width: 220,
        ...commonColumnStyles,
        renderHeader: () => <span>Created At</span>,
        renderCell: (params) => (
            <div className="flex justify-center items-center gap-1">
                <MdDateRange className="text-slate-700 text-lg" />
                <span>{params?.row?.created}</span>
            </div>
        ),
    },
    {
        field: "status",
        headerName: "Status",
        width: 200,
        ...commonColumnStyles,
        renderHeader: () => <span className="ps-10">Status</span>,
    },
    {
        field: "action",
        headerName: "Action",
        width: 200,
        ...commonColumnStyles,
        headerClassName: "text-black font-semibold text-center",
        cellClassName: "text-slate-700 font-normal",
        sortable: false,
        renderHeader: () => <span>Action</span>,
        renderCell: (params) => (
            <Link
                to={`/admin/users/${params.id}`}
                className="h-full flex items-center justify-center"
            >
                <button className="bg-btnColor text-white px-4 flex justify-center items-center h-9 rounded-md">
                    Views
                </button>
            </Link>
        ),
    },
];

export default {
    adminAuditLogColumns,
    noteAuditLogColumns,
    userListColumns,
};
