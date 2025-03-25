import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from "./MainContent/header";
import AddUser from "./MainContent/addUser";
import SearchUser from "./MainContent/searchUser";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Separate LoginCard into a component that has access to router context
function LoginCardWrapper({ setIsAuthenticated }) {
    return <LoginCard setIsAuthenticated={setIsAuthenticated} />;
}

function LoginCard({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, password }),
            });

            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                alert(data.message || "Login failed!");
            }
        } catch (error) {
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div className="logincard" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontFamily: "'Roboto', sans-serif",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        }}>
            <div style={{
                width: "300px",
                padding: "40px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
            }}>
                <h1 style={{
                    textAlign: "center",
                    margin: "0",
                    color: "#333",
                    fontSize: "24px",
                    fontWeight: "700"
                }}>AGENT LOG IN</h1>
                <input 
                    type="text" 
                    placeholder="UserID" 
                    style={{
                        border: "none",
                        borderBottom: "2px solid #3498db",
                        padding: "10px 5px",
                        fontSize: "16px",
                        transition: "border-color 0.3s",
                        outline: "none"
                    }} 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    style={{
                        border: "none",
                        borderBottom: "2px solid #3498db",
                        padding: "10px 5px",
                        fontSize: "16px",
                        transition: "border-color 0.3s",
                        outline: "none"
                    }}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button style={{
                    marginRight:"30%",
                    marginLeft:"30%",
                    width: "40%",
                    padding: "12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                }} onClick={handleLogin}>LOGIN</button>
            </div>
        </div>
    );
}

function MainLayout({ setIsAuthenticated }) {  // Add setIsAuthenticated prop
    return (
        <div style={{ background: "linear-gradient(to bottom right, #EEF2FF, #E0E7FF)", minHeight: "100vh" }}>
            <Header setIsAuthenticated={setIsAuthenticated} />
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                <AddUser />
                <SearchUser />
            </div>
        </div>
    );
}

// Moved useAuth logic into a protected route component
function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const logoutTimerRef = useRef();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const expiryTime = tokenData.exp * 1000;
                const timeUntilExpiry = expiryTime - Date.now();

                if (timeUntilExpiry <= 0) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(true);
                    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
                    logoutTimerRef.current = setTimeout(() => {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                        alert('Your session has expired. Please login again.');
                    }, timeUntilExpiry);
                }
            } catch (error) {
                console.error('Error parsing token:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        checkAuthStatus();
        return () => {
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" /> : 
                    <LoginCardWrapper setIsAuthenticated={setIsAuthenticated} />
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <MainLayout setIsAuthenticated={setIsAuthenticated} />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
