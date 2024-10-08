import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); 
      const res = await axios.post('https://frenzy-assignment.onrender.com/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);       

      navigate('/dashboard'); 
      toast.success('Logged in successfully!', { position: 'top-right' });
      
      setTimeout(()=>{
        console.log('helo')
        navigate('/dashboard'); 
      },1000)
    } catch (error) {
      setError(error.response?.data?.msg || 'Login failed');
      toast.error(error.response?.data?.msg || 'Invalid credentials', { position: 'top-right' });
     
    }finally{
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
        <Typography variant="h4" className="text-center mb-4">
          Login
        </Typography>
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-700 text-white"
            disabled={loading} 
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'} 
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className="mt-4"
            onClick={handleSignupClick}
            disabled={loading} 
          >
            Sign Up
          </Button>
        </form>
        {error && <Typography color="error" className="mt-2">{error}</Typography>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
