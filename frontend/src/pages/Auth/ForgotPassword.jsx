import { useState, useEffect } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../../components/common/InputField";
import Buttons from "../../components/common/Buttons";
import { Divider } from "@mui/material";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/useMyContext";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useMyContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
        },
        mode: "onTouched",
    });

    const onPasswordForgotHandler = async (data) => {
        const { email } = data;

        try {
            setLoading(true);

            const formData = new URLSearchParams();
            formData.append("email", email);
            await api.post("/auth/public/forgot-password", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            reset();
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error) {
            toast.error(
                "Error sending password reset email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) navigate("/");
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center py-8 px-4">
            <form
                onSubmit={handleSubmit(onPasswordForgotHandler)}
                className="sm:w-[450px] w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl py-8 sm:px-8 px-6"
            >
                <div className="text-center mb-6">
                    <h1 className="text-yellow-400 font-bold text-2xl mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-400">
                        Enter your email and a password reset link will be sent
                    </p>
                </div>

                <Divider className="bg-gray-700 mb-6" />

                <div className="flex flex-col gap-4 mb-6 mt-3">
                    <InputField
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="*Email is required"
                        placeholder="Enter your email"
                        register={register}
                        errors={errors}
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
                            Sending...
                        </span>
                    ) : (
                        "Send Reset Link"
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

export default ForgotPassword;
