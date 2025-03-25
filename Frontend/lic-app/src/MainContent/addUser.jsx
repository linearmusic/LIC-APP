import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: "",
        dateofbirth: "",
        policynumber: "",
        sumassured: "",
        TableAndTerms: "",
        ModeOfPayment: "",
        PremiumAmount: "",
        DateOfCommencement: "",
        StartFrom: "",
        MobileNo: "",
        Nominee: ""
    });
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Validate all fields
        for (const [key, value] of Object.entries(newUser)) {
            if (!value || (typeof value === 'string' && !value.trim())) {
                alert(`Please fill in ${key}`);
                return;
            }
        }

        // Validate mobile number
        if (!/^\d{10}$/.test(newUser.MobileNo)) {
            alert("Mobile number must be exactly 10 digits");
            return;
        }

        if (!window.confirm("Are you sure you want to add this user?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/inputuserdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const data = await response.json();
            if (response.ok) {
                alert("User added successfully!");
                setNewUser({
                    name: "",
                    dateofbirth: "",
                    policynumber: "",
                    sumassured: "",
                    TableAndTerms: "",
                    ModeOfPayment: "",
                    PremiumAmount: "",
                    DateOfCommencement: "",
                    StartFrom: "",
                    MobileNo: "",
                    Nominee: ""
                });
            } else {
                alert(data.message || "Failed to add user");
            }
        } catch (error) {
            alert("Error adding user. Please try again.");
        }
    };

    const toggleForm = () => setIsFormVisible(!isFormVisible);

    const inputStyle = {
        width: '90%',
        padding: '0.75rem',
        border: '1px solid #E5E7EB',
        borderRadius: '0.5rem',
        backgroundColor: '#F9FAFB',
        fontSize: '1rem'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                width: '80%',
                maxWidth: '60rem',
                background: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                padding: '2rem',
            }}>
                <h2 style={{
                    fontFamily: "sans-serif",
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#1F2937',
                    textAlign: 'center',
                    cursor: 'pointer'
                }} onClick={toggleForm}>
                    Add New Policyholder {isFormVisible ? '▼' : '▲'}
                </h2>

                <div style={{
                    width: '100%',
                    overflow: 'hidden',
                    maxHeight: isFormVisible ? '1000px' : '0',
                    transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
                    opacity: isFormVisible ? 1 : 0,
                }}>
                    <form onSubmit={handleAddUser} style={{ width: '100%' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            {[
                                { name: "name", placeholder: "Name", type: "text" },
                                { name: "policynumber", placeholder: "Policy Number", type: "text" },
                                { name: "sumassured", placeholder: "Sum Assured", type: "number" },
                                { name: "TableAndTerms", placeholder: "Table & Terms", type: "text" },
                                { name: "PremiumAmount", placeholder: "Premium Amount", type: "number" },
                                { name: "MobileNo", placeholder: "Mobile Number", type: "tel" },
                                { name: "Nominee", placeholder: "Nominee", type: "text" }
                            ].map(({ name, placeholder, type }) => (
                                <input key={name} type={type} name={name} placeholder={placeholder} value={newUser[name]} onChange={handleChange} style={inputStyle} />
                            ))}
                            
                            <select 
                                name="ModeOfPayment"
                                value={newUser.ModeOfPayment}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">Select Payment Mode</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Annually">Annually</option>
                            </select>

                            {[
                                { name: "dateofbirth", label: "Dob" },
                                { name: "DateOfCommencement", label: "Doc" },
                                { name: "StartFrom", label: "Start" }
                            ].map(({ name, label }) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', fontFamily: "sans-serif", fontWeight: "bold" }}>
                                    <label style={{ fontSize: '0.9rem', color: '#4B5563', width: '45px' }}>{label}:</label>
                                    <input type="date" name={name} value={newUser[name]} onChange={handleChange} style={{ ...inputStyle, width: 'calc(90% - 45px)', colorScheme: 'light' }} />
                                </div>
                            ))}
                        </div>

                        <button type="submit" style={{
                            marginRight: "30%",
                            marginLeft: "30%",
                            width: '40%',
                            backgroundColor: '#003366',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            fontWeight: '500',
                            fontSize: '1.125rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            marginTop: '1rem',
                            border: 'none'
                        }}>Add User</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
