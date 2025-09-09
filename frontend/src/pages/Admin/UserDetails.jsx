import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../../components/common/InputField";
import { BeatLoader } from "react-spinners";
import Buttons from "../../components/common/Buttons";
import toast from "react-hot-toast";
import Errors from "../../components/common/Errors";

const UserDetails = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const [loading, setLoading] = useState(false);
    const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
    const [passwordLoader, setPasswordLoader] = useState(false);
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [error, setError] = useState(null);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const fetchUserDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/user/${userId}`);
            console.log(response.data);
            setUser(response.data);
            setSelectedRole(response.data.role?.roleName || "");
        } catch (err) {
            setError(err?.response?.data?.message);
            console.error("Error fetching user details", err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setValue("username", user.userName);
            setValue("email", user.email);
        }
    }, [user, setValue]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await api.get("/admin/roles");
            setRoles(response.data);
        } catch (err) {
            setError(err?.response?.data?.message);
            console.error("Error fetching roles", err);
        }
    }, []);

    useEffect(() => {
        fetchUserDetails();
        fetchRoles();
    }, [fetchUserDetails, fetchRoles]);

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleUpdateRole = async () => {
        setUpdateRoleLoader(true);
        try {
            const formData = new URLSearchParams();
            formData.append("userId", userId);
            formData.append("roleName", selectedRole);

            await api.put(`/admin/update-role`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            fetchUserDetails();
            toast.success("Update role successful");
        } catch (err) {
            console.log(err);
            toast.error("Update Role Failed");
        } finally {
            setUpdateRoleLoader(false);
        }
    };

    const handleSavePassword = async (data) => {
        setPasswordLoader(true);
        const newPassword = data.password;

        try {
            const formData = new URLSearchParams();
            formData.append("userId", userId);
            formData.append("password", newPassword);

            await api.put(`/admin/update-password`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            setIsEditingPassword(false);
            setValue("password", "");
            toast.success("Password updated successfully");
        } catch (err) {
            toast.error("Error updating password " + err.response.data);
        } finally {
            setPasswordLoader(false);
        }
    };

    const handleCheckboxChange = async (e, updateUrl) => {
        const { name, checked } = e.target;

        let message = null;
        if (name === "lock") {
            message = "Update Account Lock status Successful";
        } else if (name === "expire") {
            message = "Update Account Expiry status Successful";
        } else if (name === "enabled") {
            message = "Update Account Enabled status Successful";
        } else if (name === "credentialsExpire") {
            message = "Update Account Credentials Expired status Successful";
        }

        try {
            const formData = new URLSearchParams();
            formData.append("userId", userId);
            formData.append(name, checked);

            await api.put(updateUrl, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            fetchUserDetails();
            toast.success(message);
        } catch (err) {
            toast.error(err?.response?.data?.message);
            console.log(`Error updating ${name}:`);
        } finally {
            message = null;
        }
    };

    if (error) {
        return <Errors message={error} />;
    }

    return (
        <div className="sm:px-12 px-4 py-10 bg-gray-900 min-h-screen">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-72">
                    <BeatLoader
                        height="70"
                        width="70"
                        color="#fbbf24"
                        loading={true}
                    />
                    <span className="text-gray-300 mt-4">
                        Loading user details...
                    </span>
                </div>
            ) : (
                <>
                    <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
                        <div>
                            <h1 className="text-yellow-400 text-2xl font-bold pb-4 border-b border-gray-700">
                                Profile Information
                            </h1>
                            <form
                                className="flex flex-col gap-4 mt-4"
                                onSubmit={handleSubmit(handleSavePassword)}
                            >
                                <InputField
                                    label="Username"
                                    required
                                    id="username"
                                    className="w-full"
                                    type="text"
                                    message="*Username is required"
                                    placeholder="Enter your Username"
                                    register={register}
                                    errors={errors}
                                    readOnly
                                />
                                <InputField
                                    label="Email"
                                    required
                                    id="email"
                                    className="flex-1"
                                    type="text"
                                    message="*Email is required"
                                    placeholder="Enter your Email"
                                    register={register}
                                    errors={errors}
                                    readOnly
                                />
                                <InputField
                                    label="Password"
                                    required
                                    autoFocus={isEditingPassword}
                                    id="password"
                                    className="w-full"
                                    type="password"
                                    message="*Password is required"
                                    placeholder="Enter your Password"
                                    register={register}
                                    errors={errors}
                                    readOnly={!isEditingPassword}
                                    min={6}
                                />
                                {!isEditingPassword ? (
                                    <Buttons
                                        type="button"
                                        onClickhandler={() =>
                                            setIsEditingPassword(
                                                !isEditingPassword
                                            )
                                        }
                                        className="bg-yellow-500 mb-0 w-fit px-4 py-2 rounded-lg text-gray-900 hover:bg-yellow-600 transition-colors duration-200"
                                    >
                                        Click To Edit Password
                                    </Buttons>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Buttons
                                            type="submit"
                                            className="bg-yellow-500 mb-0 w-fit px-4 py-2 rounded-lg text-gray-900 hover:bg-yellow-600 transition-colors duration-200"
                                        >
                                            {passwordLoader
                                                ? "Loading.."
                                                : "Save"}
                                        </Buttons>
                                        <Buttons
                                            type="button"
                                            onClickhandler={() =>
                                                setIsEditingPassword(
                                                    !isEditingPassword
                                                )
                                            }
                                            className="bg-red-600 mb-0 w-fit px-4 py-2 rounded-lg text-white hover:bg-red-700 transition-colors duration-200"
                                        >
                                            Cancel
                                        </Buttons>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className="lg:w-[70%] sm:w-[90%] w-full mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8">
                        <h1 className="text-yellow-400 text-2xl font-bold pb-4 border-b border-gray-700">
                            Admin Actions
                        </h1>

                        <div className="py-4 flex sm:flex-row flex-col sm:items-center items-start gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-gray-300 text-lg font-semibold">
                                    Role:
                                </label>
                                <select
                                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600"
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                >
                                    {roles.map((role) => (
                                        <option
                                            className="bg-gray-700 uppercase text-gray-200"
                                            key={role.roleId}
                                            value={role.roleName}
                                        >
                                            {role.roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Buttons
                                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-gray-900 transition-colors duration-200"
                                onClickhandler={handleUpdateRole}
                            >
                                {updateRoleLoader
                                    ? "Loading..."
                                    : "Update Role"}
                            </Buttons>
                        </div>

                        <hr className="py-2 border-gray-700" />
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex items-center gap-2">
                                <label className="text-gray-300 text-sm font-semibold uppercase">
                                    Account Locked
                                </label>
                                <input
                                    className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                                    type="checkbox"
                                    name="lock"
                                    checked={!user?.accountNonLocked}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            "/admin/update-lock-status"
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-gray-300 text-sm font-semibold uppercase">
                                    Account Expired
                                </label>
                                <input
                                    className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                                    type="checkbox"
                                    name="expire"
                                    checked={!user?.accountNonExpired}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            "/admin/update-expiry-status"
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-gray-300 text-sm font-semibold uppercase">
                                    Account Disabled
                                </label>
                                <input
                                    className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                                    type="checkbox"
                                    name="enabled"
                                    checked={!user?.enabled}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            "/admin/update-enabled-status"
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-gray-300 text-sm font-semibold uppercase">
                                    Credentials Expired
                                </label>
                                <input
                                    className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                                    type="checkbox"
                                    name="credentialsExpire"
                                    checked={!user?.credentialsNonExpired}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDetails;
