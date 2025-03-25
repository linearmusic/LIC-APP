import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchUser() {
    const navigate = useNavigate();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        phone: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            const queryParams = new URLSearchParams();
            if (searchQuery.name) queryParams.append('name', searchQuery.name);
            if (searchQuery.phone) queryParams.append('MobileNo', searchQuery.phone);

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/get-user?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const data = await response.json();
            if (response.ok) {
                setSearchResults(data.data || []); // Access the data property
            } else {
                setError(data.message || "Something went wrong!");
            }
        } catch (err) {
            setError("Failed to fetch data. Please try again later.");
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const style = {
        width: '90%',
        padding: '0.75rem',
        border: '1px solid #E5E7EB',
        borderRadius: '0.5rem',
        backgroundColor: '#F9FAFB',
        fontSize: '1rem',
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
                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                    <h2 style={{
                        fontFamily: "sans-serif",
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        color: '#1F2937',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }} onClick={toggleSearch}>
                        Search Policyholder {isSearchVisible ? '▼' : '▲'}
                    </h2>
                </div>
                <div style={{
                    width: '100%',
                    overflow: 'hidden',
                    maxHeight: isSearchVisible ? '1000px' : '0',
                    transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
                    opacity: isSearchVisible ? 1 : 0,
                }}>
                    <form onSubmit={handleSearch} style={{ width: '100%' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            <input
                                type="text"
                                placeholder="Search by Name"
                                value={searchQuery.name}
                                onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
                                style={style}
                            />
                            <input
                                type="tel"
                                placeholder="Search by Phone Number"
                                value={searchQuery.phone}
                                onChange={(e) => setSearchQuery({ ...searchQuery, phone: e.target.value })}
                                style={style}
                            />
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
                        }}>Search</button>
                    </form>

                    {/* Results section */}
                    <div style={{ marginTop: '2rem' }}>
                        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
                        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                        {!loading && searchResults.length === 0 && !error && <p style={{ textAlign: 'center' }}>No results found</p>}
                        {searchResults.map(result => (
                            <div key={result.id} style={{
                                padding: '1.5rem',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem',
                                backgroundColor: '#F9FAFB'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Name: {result.name}</h3>
                                        <p>DOB: {formatDate(result.dateofbirth)}</p>
                                        <p>Policy Number: {result.policynumber}</p>
                                        <p>Sum Assured: {result.sumassured}</p>
                                    </div>
                                    <div>
                                        <p>Table & Terms: {result.TableAndTerms}</p>
                                        <p>Mode of Payment: {result.ModeOfPayment}</p>
                                        <p>Premium Amount: {result.PremiumAmount}</p>
                                        <p>DOC: {formatDate(result.DateOfCommencement)}</p>
                                    </div>
                                    <div>
                                        <p>Start From: {formatDate(result.StartFrom)}</p>
                                        <p>Mobile: {result.MobileNo}</p>
                                        <p>Nominee: {result.Nominee}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
