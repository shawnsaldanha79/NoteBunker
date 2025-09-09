import { Link, useLocation } from "react-router-dom";
import { LiaBlogSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa";

const AdminSidebar = () => {
    const pathName = useLocation().pathname;

    return (
        <div className="fixed p-3 top-[64px] min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] z-20 left-0 bg-gray-800 border-r border-gray-700 w-60">
            <div className="flex flex-col gap-3">
                <Link
                    to="/admin/users"
                    className={`flex text-gray-300 items-center gap-3 ${
                        pathName.startsWith("/admin/users")
                            ? "bg-yellow-500 text-gray-900"
                            : "bg-transparent hover:bg-gray-700"
                    } min-h-10 py-2 px-3 rounded-lg`}
                >
                    <span>
                        <FaUser />
                    </span>
                    <span className="transition-all font-semibold ease-in-out">
                        All Users
                    </span>
                </Link>
                <Link
                    to="/admin/audit-logs"
                    className={`flex text-gray-300 items-center gap-3 ${
                        pathName.startsWith("/admin/audit-logs")
                            ? "bg-yellow-500 text-gray-900"
                            : "bg-transparent hover:bg-gray-700"
                    } min-h-10 py-2 px-3 rounded-lg`}
                >
                    <span>
                        <LiaBlogSolid className="text-xl" />
                    </span>
                    <span className="transition-all font-semibold ease-in-out">
                        Audit Logs
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;
