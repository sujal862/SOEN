import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/user.context.jsx'
import axios from '../config/axios.jsx'

const UserAuth = ({ children }) => {
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch user profile
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserProfile();
    }, []); // Run once on component mount
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default UserAuth;