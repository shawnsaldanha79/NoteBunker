import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../../components/common/InputField";
import Buttons from "../../components/common/Buttons";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: "",
        },
        mode: "onTouched",
    });

    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const handleResetPassword = async (data) => {
        const { password } = data;
        const token = searchParams.get("token");

        setLoading(true);
        try {
            const formData = new URLSearchParams();

            formData.append("token", token);
            formData.append("newPassword", password);
            await api.post("/auth/public/reset-password", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            toast.success("Password reset successful! You can now log in.");
            reset();
        } catch (error) {
            toast.error("Error resetting password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center py-8 px-4">
            <form
                onSubmit={handleSubmit(handleResetPassword)}
                className="sm:w-[450px] w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl py-8 sm:px-8 px-6"
            >
                <div className="text-center mb-6">
                    <h1 className="text-yellow-400 font-bold text-2xl mb-2">
                        Update Your Password
                    </h1>
                    <p className="text-gray-400">
                        Enter your new password to update it
                    </p>
                </div>

                <Divider className="bg-gray-700 mb-6" />

                <div className="flex flex-col gap-4 mb-6 mt-3">
                    <InputField
                        label="New Password"
                        required
                        id="password"
                        type="password"
                        message="*Password is required"
                        placeholder="Enter your new password"
                        register={register}
                        errors={errors}
                        min={6}
                    />
                </div>

                <Buttons
                    disabled={loading}
                    onClickhandler={() => {}}
                    className="bg-yellow-500 text-gray-900 font-semibold w-full py-3 hover:bg-yellow-600 transition-colors duration-200 rounded-lg mb-4"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Updating...
                        </span>
                    ) : (
                        "Update Password"
                    )}
                </Buttons>

                <p className="text-center text-gray-400 text-sm">
                    <Link
                        className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                        to="/login"
                    >
                        Back To Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ResetPassword;
