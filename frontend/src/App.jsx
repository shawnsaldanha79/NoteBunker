import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AllNotes from "./pages/Notes/AllNotes";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AccessDenied from "./pages/Auth/AccessDenied";
import NoteDetails from "./pages/Notes/NoteDetails";
import CreateNote from "./pages/Notes/CreateNote";
import LandingPage from "./pages/LandingPage/LandingPage";
import Admin from "./pages/Admin/Admin";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Toaster position="bottom-center" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route
                    path="/notes/:id"
                    element={
                        <ProtectedRoute>
                            <NoteDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <AllNotes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-note"
                    element={
                        <ProtectedRoute>
                            <CreateNote />
                        </ProtectedRoute>
                    }
                />

                <Route path="/access-denied" element={<AccessDenied />} />

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute adminPage={true}>
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                <Route path="/*" element={<NotFound />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
