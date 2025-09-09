import { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../store/useMyContext";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../../components/common/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../components/common/Buttons";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import Errors from "../../components/common/Errors";
import QRCode from "react-qr-code";

const UserProfile = () => {
    const { currentUser, token } = useMyContext();
    const [loginSession, setLoginSession] = useState(null);
    const [credentialExpireDate, setCredentialExpireDate] = useState(null);
    const [pageError, setPageError] = useState(false);
    const [accountExpired, setAccountExpired] = useState();
    const [accountLocked, setAccountLock] = useState();
    const [accountEnabled, setAccountEnabled] = useState();
    const [credentialExpired, setCredentialExpired] = useState();
    const [openAccount, setOpenAccount] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [disabledLoader, setDisbledLoader] = useState(false);
    const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: currentUser?.username,
            email: currentUser?.email,
            password: "",
        },
        mode: "onTouched",
    });

    useEffect(() => {
        setPageLoader(true);
        const fetch2FAStatus = async () => {
            try {
                const response = await api.get(`/auth/user/2fa-status`);
                setIs2faEnabled(response.data.is2faEnabled);
            } catch (error) {
                setPageError(error?.response?.data?.message);
                toast.error("Error fetching 2FA status");
            } finally {
                setPageLoader(false);
            }
        };
        fetch2FAStatus();
    }, []);

    const enable2FA = async () => {
        setDisbledLoader(true);
        try {
            const response = await api.post(`/auth/enable-2fa`);
            setQrCodeUrl(response.data);
            setStep(2);
        } catch (error) {
            toast.error("Error enabling 2FA");
        } finally {
            setDisbledLoader(false);
        }
    };

    const disable2FA = async () => {
        setDisbledLoader(true);
        try {
            await api.post(`/auth/disable-2fa`);
            setIs2faEnabled(false);
            setQrCodeUrl("");
        } catch (error) {
            toast.error("Error disabling 2FA");
        } finally {
            setDisbledLoader(false);
        }
    };

    const verify2FA = async () => {
        if (!code || code.trim().length === 0)
            return toast.error("Please Enter The Code To Verify");

        settwofaCodeLoader(true);

        try {
            const formData = new URLSearchParams();
            formData.append("code", code);

            await api.post(`/auth/verify-2fa`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            toast.success("2FA verified successful");

            setIs2faEnabled(true);
            setStep(1);
        } catch (error) {
            console.error("Error verifying 2FA", error);
            toast.error("Invalid 2FA Code");
        } finally {
            settwofaCodeLoader(false);
        }
    };

    const handleUpdateCredential = async (data) => {
        const newUsername = data.username;
        const newPassword = data.password;

        try {
            setLoading(true);
            const formData = new URLSearchParams();
            formData.append("token", token);
            formData.append("newUsername", newUsername);
            formData.append("newPassword", newPassword);
            await api.post("/auth/update-credentials", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            toast.success("Update Credential successful");
        } catch (error) {
            toast.error("Update Credential failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            setValue("username", currentUser.username);
            setValue("email", currentUser.email);
            setAccountExpired(!currentUser.accountNonExpired);
            setAccountLock(!currentUser.accountNonLocked);
            setAccountEnabled(currentUser.enabled);
            setCredentialExpired(!currentUser.credentialsNonExpired);

            const expiredFormatDate = moment(
                currentUser?.credentialsExpiryDate
            ).format("D MMMM YYYY");
            setCredentialExpireDate(expiredFormatDate);
        }
    }, [currentUser, setValue]);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);

            const lastLoginSession = moment
                .unix(decodedToken.iat)
                .format("dddd, D MMMM YYYY, h:mm A");
            setLoginSession(lastLoginSession);
        }
    }, [token]);

    const handleAccountExpiryStatus = async (event) => {
        setAccountExpired(event.target.checked);

        try {
            const formData = new URLSearchParams();
            formData.append("token", token);
            formData.append("expire", event.target.checked);

            await api.put("/auth/update-expiry-status", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            toast.success("Update Account Expirey Status");
        } catch (error) {
            toast.error("Update expirey status failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAccountLockStatus = async (event) => {
        setAccountLock(event.target.checked);

        try {
            const formData = new URLSearchParams();
            formData.append("token", token);
            formData.append("lock", event.target.checked);

            await api.put("/auth/update-lock-status", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            toast.success("Update Account Lock Status");
        } catch (error) {
            toast.error("Update Account Lock status failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAccountEnabledStatus = async (event) => {
        setAccountEnabled(event.target.checked);
        try {
            const formData = new URLSearchParams();
            formData.append("token", token);
            formData.append("enabled", event.target.checked);

            await api.put("/auth/update-enabled-status", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            toast.success("Update Account Enabled Status");
        } catch (error) {
            toast.error("Update Account Enabled status failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCredentialExpiredStatus = async (event) => {
        setCredentialExpired(event.target.checked);
        try {
            const formData = new URLSearchParams();
            formData.append("token", token);
            formData.append("expire", event.target.checked);

            await api.put("/auth/update-credentials-expiry-status", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            toast.success("Update Credentials Expiry Status");
        } catch (error) {
            toast.error("Credentials Expiry Status Failed");
        } finally {
            setLoading(false);
        }
    };

    if (pageError) {
        return <Errors message={pageError} />;
    }

    const onOpenAccountHandler = () => {
        setOpenAccount(!openAccount);
        setOpenSetting(false);
    };
    const onOpenSettingHandler = () => {
        setOpenSetting(!openSetting);
        setOpenAccount(false);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 py-8 px-4">
            {pageLoader ? (
                <div className="flex flex-col justify-center items-center h-72">
                    <BeatLoader
                        height="70"
                        width="70"
                        color="#fbbf24"
                        loading={true}
                    />
                    <span className="text-gray-300 mt-4">
                        Loading profile...
                    </span>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto min-h-[500px] flex lg:flex-row flex-col gap-6">
                    <div className="flex-1 flex flex-col bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <Avatar
                                alt={currentUser?.username}
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: 80, height: 80 }}
                                className="border-2 border-yellow-500"
                            />
                            <h3 className="font-bold text-2xl text-yellow-400">
                                {currentUser?.username}
                            </h3>
                        </div>

                        <div className="mb-6">
                            <div className="space-y-3 px-2 mb-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="font-semibold text-yellow-300">
                                        Username:
                                    </span>
                                    <span className="text-gray-300">
                                        {currentUser?.username}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="font-semibold text-yellow-300">
                                        Role:
                                    </span>
                                    <span className="text-gray-300">
                                        {currentUser && currentUser["roles"][0]}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="font-semibold text-yellow-300">
                                        Email:
                                    </span>
                                    <span className="text-gray-300">
                                        {currentUser?.email}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <Accordion
                                    expanded={openAccount}
                                    sx={{
                                        backgroundColor: "#1f2937",
                                        color: "white",
                                        borderRadius: "0.5rem",
                                        overflow: "hidden",
                                        marginBottom: "1rem",
                                        "&:before": { display: "none" },
                                    }}
                                >
                                    <AccordionSummary
                                        onClick={onOpenAccountHandler}
                                        expandIcon={
                                            <ArrowDropDownIcon
                                                sx={{ color: "#fbbf24" }}
                                            />
                                        }
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        sx={{
                                            backgroundColor: "#111827",
                                            padding: "0.75rem 1rem",
                                        }}
                                    >
                                        <h3 className="text-yellow-400 text-lg font-semibold">
                                            Update User Credentials
                                        </h3>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: "1rem" }}>
                                        <form
                                            className="flex flex-col gap-4"
                                            onSubmit={handleSubmit(
                                                handleUpdateCredential
                                            )}
                                        >
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
                                                label="Email"
                                                required
                                                id="email"
                                                type="email"
                                                message="*Email is required"
                                                placeholder="Enter your email"
                                                register={register}
                                                errors={errors}
                                                readOnly
                                            />
                                            <InputField
                                                label="Enter New Password"
                                                id="password"
                                                type="password"
                                                message="*Password is required"
                                                placeholder="Type your password"
                                                register={register}
                                                errors={errors}
                                                min={6}
                                            />
                                            <Buttons
                                                disabled={loading}
                                                className="bg-yellow-500 text-gray-900 font-semibold w-full py-3 hover:bg-yellow-600 transition-colors duration-200 rounded-lg"
                                                type="submit"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                                        Updating...
                                                    </span>
                                                ) : (
                                                    "Update Credentials"
                                                )}
                                            </Buttons>
                                        </form>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    expanded={openSetting}
                                    sx={{
                                        backgroundColor: "#1f2937",
                                        color: "white",
                                        borderRadius: "0.5rem",
                                        overflow: "hidden",
                                        "&:before": { display: "none" },
                                    }}
                                >
                                    <AccordionSummary
                                        onClick={onOpenSettingHandler}
                                        expandIcon={
                                            <ArrowDropDownIcon
                                                sx={{ color: "#fbbf24" }}
                                            />
                                        }
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                        sx={{
                                            backgroundColor: "#111827",
                                            padding: "0.75rem 1rem",
                                        }}
                                    >
                                        <h3 className="text-yellow-400 text-lg font-semibold">
                                            Account Settings
                                        </h3>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: "1rem" }}>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-yellow-300 font-semibold">
                                                        Account Expired
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Prevent login if account
                                                        is expired
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={accountExpired}
                                                    onChange={
                                                        handleAccountExpiryStatus
                                                    }
                                                    color="warning"
                                                />
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-yellow-300 font-semibold">
                                                        Account Locked
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Prevent login if account
                                                        is locked
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={accountLocked}
                                                    onChange={
                                                        handleAccountLockStatus
                                                    }
                                                    color="warning"
                                                />
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-yellow-300 font-semibold">
                                                        Account Enabled
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Enable or disable
                                                        account
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={accountEnabled}
                                                    onChange={
                                                        handleAccountEnabledStatus
                                                    }
                                                    color="warning"
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <h3 className="text-yellow-300 font-semibold mb-2">
                                                    Credential Settings
                                                </h3>
                                                <div className="bg-gray-700 p-4 rounded-lg">
                                                    <p className="text-gray-300 text-sm">
                                                        Your credentials will
                                                        expire on{" "}
                                                        <span className="text-yellow-400 font-medium">
                                                            {
                                                                credentialExpireDate
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-yellow-300 font-semibold">
                                                        Credential Expired
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Force password reset if
                                                        expired
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={credentialExpired}
                                                    onChange={
                                                        handleCredentialExpiredStatus
                                                    }
                                                    color="warning"
                                                />
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-yellow-400 text-lg font-semibold mb-3">
                                    Last Login Session
                                </h3>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-300">
                                        Your last login session:{" "}
                                        <span className="text-yellow-400 font-medium">
                                            {loginSession}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                                <h1 className="text-yellow-400 text-2xl font-bold">
                                    Multi-Factor Authentication
                                </h1>
                                <span
                                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                        is2faEnabled
                                            ? "bg-green-900 text-green-300"
                                            : "bg-red-900 text-red-300"
                                    }`}
                                >
                                    {is2faEnabled ? "ACTIVE" : "INACTIVE"}
                                </span>
                            </div>
                            <p className="text-gray-300">
                                Two-factor authentication adds an additional
                                layer of security to your account by requiring
                                more than just a password to sign in.
                            </p>
                        </div>

                        <div className="mb-6">
                            <Buttons
                                disabled={disabledLoader}
                                onClickhandler={
                                    is2faEnabled ? disable2FA : enable2FA
                                }
                                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                                    is2faEnabled
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                                }`}
                            >
                                {disabledLoader ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        {is2faEnabled
                                            ? "Disable Two-Factor Authentication"
                                            : "Enable Two-Factor Authentication"}
                                    </>
                                )}
                            </Buttons>
                        </div>

                        {step === 2 && (
                            <div className="bg-gray-700 rounded-xl p-5">
                                <h3 className="text-yellow-400 font-bold text-lg mb-4">
                                    Scan QR Code
                                </h3>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-4 rounded-lg mb-4">
                                        <QRCode
                                            value={qrCodeUrl}
                                            size={200}
                                            level="H"
                                            includeMargin
                                        />
                                    </div>
                                    <p className="text-gray-300 text-sm mb-4 text-center">
                                        Scan this QR code with your
                                        authenticator app to set up two-factor
                                        authentication.
                                    </p>
                                    <div className="flex flex-col w-full gap-3">
                                        <input
                                            type="text"
                                            placeholder="Enter verification code"
                                            value={code}
                                            required
                                            className="bg-gray-600 text-white px-4 py-3 rounded-lg border border-gray-500 focus:border-yellow-500 focus:outline-none"
                                            onChange={(e) =>
                                                setCode(e.target.value)
                                            }
                                        />
                                        <Buttons
                                            onClickhandler={verify2FA}
                                            className="bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                        >
                                            {twofaCodeLoader ? (
                                                <span className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                                    Verifying...
                                                </span>
                                            ) : (
                                                "Verify Code"
                                            )}
                                        </Buttons>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
