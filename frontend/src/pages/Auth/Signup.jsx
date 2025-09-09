import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import InputField from "../../components/common/InputField";
import { GrGoogle, GrGithub } from "react-icons/gr";
import Divider from "@mui/material/Divider";
import Buttons from "../../components/common/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/useMyContext";

const apiUrl = import.meta.env.VITE_API_URL;

const Signup = () => {
    const [role, setRole] = useState();
    const [loading, setLoading] = useState(false);
    const { token } = useMyContext();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    useEffect(() => {
        setRole("ROLE_USER");
    }, []);

    const onSubmitHandler = async (data) => {
        const { username, email, password } = data;
        const sendData = {
            username,
            email,
            password,
            role: [role],
        };

        try {
            setLoading(true);
            const response = await api.post("/auth/public/signup", sendData);
            toast.success("Registration Successful");
            reset();
            if (response.data) {
                navigate("/login");
            }
        } catch (error) {
            if (
                error?.response?.data?.message ===
                "Error: Username is already taken!"
            ) {
                setError("username", { message: "Username is already taken" });
            } else if (
                error?.response?.data?.message ===
                "Error: Email is already in use!"
            ) {
                setError("email", { message: "Email is already in use" });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) navigate("/");
    }, [navigate, token]);

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center py-8 px-4">
            <form
                onSubmit={handleSubmit(onSubmitHandler)}
                className="sm:w-[450px] w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl py-8 sm:px-8 px-6"
            >
                <div className="text-center mb-6">
                    <h1 className="text-yellow-400 font-bold text-2xl mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-400 mb-6">
                        Enter your details to create a new account
                    </p>

                    <div className="flex flex-col gap-3 mb-6">
                        <a
                            href={`${apiUrl}/oauth2/authorization/google`}
                            className="flex gap-2 items-center justify-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                            <GrGoogle className="text-xl text-red-400" />
                            <span className="font-semibold text-gray-200">
                                Sign up with Google
                            </span>
                        </a>
                        <a
                            href={`${apiUrl}/oauth2/authorization/github`}
                            className="flex gap-2 items-center justify-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                            <GrGithub className="text-xl text-gray-200" />
                            <span className="font-semibold text-gray-200">
                                Sign up with Github
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
                        placeholder="Choose a username"
                        register={register}
                        errors={errors}
                    />
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
                    <InputField
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="*Password is required"
                        placeholder="Create a password"
                        register={register}
                        errors={errors}
                        min={6}
                    />
                </div>

                <Buttons
                    disabled={loading}
                    onClickhandler={() => {}}
                    className="bg-yellow-500 text-gray-900 font-semibold w-full py-3 hover:bg-yellow-600 transition-colors duration-200 rounded-lg mb-6"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Creating account...
                        </span>
                    ) : (
                        "Create Account"
                    )}
                </Buttons>

                <p className="text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link
                        className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors duration-200"
                        to="/login"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
