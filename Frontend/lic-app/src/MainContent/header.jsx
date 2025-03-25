import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ setIsAuthenticated }) {  // Add setIsAuthenticated prop
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        setIsLoggingOut(true);
        // Immediately clear auth state
        localStorage.removeItem('token');
        setIsAuthenticated(false);  // Update parent state

        try {
            // Make the logout API call in background
            await fetch('http://localhost:3000/admin/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
            navigate('/login', { replace: true });  // Force navigation with replace
        }
    };

    return (
        <div className="Header" style={{
            height:"8vh",
            backgroundColor:"#003366",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px"
        }}>
            <div style={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flex: 1
            }}>
                <a href="" style={{
                    textDecoration:"none",
                    color: "white",
                    textAlign: "center",
                    fontSize: "2rem",
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    fontWeight: "500",
                    letterSpacing: "1px",
                    margin: 0,
                    textTransform: "uppercase"
                }}>AGENT APP</a>
            </div>
            <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid white",
                    borderRadius: "5px",
                    cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.3s",
                    opacity: isLoggingOut ? 0.7 : 1,
                    ':hover': {
                        backgroundColor: "white",
                        color: "#003366"
                    }
                }}
            >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
}
