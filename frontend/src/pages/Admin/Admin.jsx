import { Route, Routes } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminAreaSidebar";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import AuditLogsDetails from "./AuditLogsDetails";
import AdminAuditLogs from "./AdminAuditLogs";

const Admin = () => {
    return (
        <div className="flex bg-gray-900 min-h-screen">
            <AdminSidebar />
            <div className="transition-all overflow-hidden flex-1 duration-200 w-full min-h-[calc(100vh-64px)] lg:ml-60">
                <Routes>
                    <Route path="audit-logs" element={<AdminAuditLogs />} />
                    <Route
                        path="audit-logs/:noteId"
                        element={<AuditLogsDetails />}
                    />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/:userId" element={<UserDetails />} />
                </Routes>
            </div>
        </div>
    );
};

export default Admin;