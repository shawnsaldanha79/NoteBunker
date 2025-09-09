import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../../components/common/InputField";
import { GrGoogle, GrGithub } from "react-icons/gr";
import Divider from "@mui/material/Divider";
import Buttons from "../../components/common/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/useMyContext";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
    const [step, setStep] = useState(1);
    const [jwtToken, setJwtToken] = useState("");
    const [loading, setLoading] = useState(false);
    const { setToken, token } = useMyContext();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
            code: "",
        },
        mode: "onTouched",
    });

    const handleSuccessfulLogin = (token, decodedToken) => {
        const user = {
            username: decodedToken.sub,
            roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
        };
        localStorage.setItem("JWT_TOKEN", token);
        localStorage.setItem("USER", JSON.stringify(user));

        setToken(token);
        navigate("/notes");
    };

    const onLoginHandler = async (data) => {
        try {
            setLoading(true);
            const response = await api.post("/auth/public/signin", data);

            toast.success("Login Successful");
            reset();

            if (response.status === 200 && response.data.jwtToken) {
                setJwtToken(response.data.jwtToken);
                const decodedToken = jwtDecode(response.data.jwtToken);
                if (decodedToken.is2faEnabled) {
                    setStep(2);
                } else {
                    handleSuccessfulLogin(response.data.jwtToken, decodedToken);
                }
            } else {
                toast.error(
                    "Login failed. Please check your credentials and try again."
                );
            }
        } catch (error) {
            if (error) {
                toast.error("Invalid credentials");
            }
        } finally {
            setLoading(false);
        }
    };

    const onVerify2FaHandler = async (data) => {
        const code = data.code;
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("code", code);
            formData.append("jwtToken", jwtToken);

            await api.post("/auth/public/verify-2fa-login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const decodedToken = jwtDecode(jwtToken);
            handleSuccessfulLogin(jwtToken, decodedToken);
        } catch (error) {
            console.error("2FA verification error", error);
            toast.error("Invalid 2FA code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) navigate("/");
    }, [navigate, token]);

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center py-8 px-4">
            {step === 1 ? (
                <form
                    onSubmit={handleSubmit(onLoginHandler)}
                    className="sm:w-[450px] w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl py-8 sm:px-8 px-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-yellow-400 font-bold text-2xl mb-2">
                            Login Here
                        </h1>
                        <p className="text-gray-400 mb-6">
                            Please enter your username and password
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                            <a
                                href={`${apiUrl}/oauth2/authorization/google`}
                                className="flex gap-2 items-center justify-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                <GrGoogle className="text-xl text-red-400" />
                                <span className="font-semibold text-gray-200">
                                    Login with Google
                                </span>
                            </a>
                            <a
                                href={`${apiUrl}/oauth2/authorization/github`}
                                className="flex gap-2 items-center justify-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                <GrGithub className="text-xl text-gray-200" />
                                <span className="font-semibold text-gray-200">
                                    Login with Github
                                </span>
                            </a>
                        </div>

                        <Divider className="text-gray-400 mb-6">OR</Divider>
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                        <InputField
                            label="Username"
                            required
                            id="username"
                            type="text"
                            message="*Username is required"
                            placeholder="Enter your username"
                            register={register}
                            errors={errors}
                        />
                        <InputField
                            label="Password"
                            required
                            id="password"
                            type="password"
                            message="*Password is required"
                            placeholder="Enter your password"
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
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </Buttons>

                    <p className="text-center text-gray-400 text-sm mb-6">
                        <Link
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>
                    </p>

                    <p className="text-center text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link
                            className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors duration-200"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            ) : (
                <form
                    onSubmit={handleSubmit(onVerify2FaHandler)}
                    className="sm:w-[450px] w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl py-8 sm:px-8 px-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-yellow-400 font-bold text-2xl mb-2">
                            Verify 2FA
                        </h1>
                        <p className="text-gray-400">
                            Enter the code from your authenticator app
                        </p>

                        <Divider className="bg-gray-700 my-6" />
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                        <InputField
                            label="Verification Code"
                            required
                            id="code"
                            type="text"
                            message="*Code is required"
                            placeholder="Enter your 2FA code"
                            register={register}
                            errors={errors}
                        />
                    </div>

                    <Buttons
                        disabled={loading}
                        onClickhandler={() => {}}
                        className="bg-yellow-500 text-gray-900 font-semibold w-full py-3 hover:bg-yellow-600 transition-colors duration-200 rounded-lg"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                Verifying...
                            </span>
                        ) : (
                            "Verify Code"
                        )}
                    </Buttons>
                </form>
            )}
        </div>
    );
};

export default Login;
