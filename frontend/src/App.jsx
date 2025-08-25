import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Toaster position="bottom-center" reverseOrder={false} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
