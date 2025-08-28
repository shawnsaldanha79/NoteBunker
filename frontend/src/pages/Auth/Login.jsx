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
        <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
            {step === 1 ? (
                <form
                    onSubmit={handleSubmit(onLoginHandler)}
                    className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4"
                >
                    <div>
                        <h1 className="font-montserrat text-center font-bold text-2xl">
                            Login Here
                        </h1>
                        <p className="text-slate-600 text-center">
                            Please Enter your username and password
                        </p>
                        <div className="flex items-center justify-between gap-1 py-5">
                            <Link
                                to={`${apiUrl}/oauth2/authorization/google`}
                                className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
                            >
                                <GrGoogle className="text-2xl" />
                                <span className="font-semibold sm:text-customText text-xs">
                                    Login with Google
                                </span>
                            </Link>
                            <Link
                                to={`${apiUrl}/oauth2/authorization/github`}
                                className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
                            >
                                <GrGithub className="text-2xl" />
                                <span className="font-semibold sm:text-customText text-xs">
                                    Login with Github
                                </span>
                            </Link>
                        </div>

                        <Divider className="font-semibold">OR</Divider>
                    </div>

                    <div className="flex flex-col gap-2">
                        <InputField
                            label="UserName"
                            required
                            id="username"
                            type="text"
                            message="*UserName is required"
                            placeholder="type your username"
                            register={register}
                            errors={errors}
                        />
                        <InputField
                            label="Password"
                            required
                            id="password"
                            type="password"
                            message="*Password is required"
                            placeholder="type your password"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <Buttons
                        disabled={loading}
                        onClickhandler={() => {}}
                        className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                        type="text"
                    >
                        {loading ? <span>Loading...</span> : "LogIn"}
                    </Buttons>
                    <p className="text-sm text-slate-700">
                        <Link
                            className="underline hover:text-black"
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>
                    </p>

                    <p className="text-center text-sm text-slate-700 mt-6">
                        Don't have an account?{" "}
                        <Link
                            className="font-semibold underline hover:text-black"
                            to="/signup"
                        >
                            SignUp
                        </Link>
                    </p>
                </form>
            ) : (
                <form
                    onSubmit={handleSubmit(onVerify2FaHandler)}
                    className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4"
                >
                    <div>
                        <h1 className="font-montserrat text-center font-bold text-2xl">
                            Verify 2FA
                        </h1>
                        <p className="text-slate-600 text-center">
                            Enter the correct code to complete 2FA
                            Authentication
                        </p>

                        <Divider className="font-semibold pb-4"></Divider>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <InputField
                            label="Enter Code"
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
                        className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                        type="text"
                    >
                        {loading ? <span>Loading...</span> : "Verify 2FA"}
                    </Buttons>
                </form>
            )}
        </div>
    );
};

export default Login;
