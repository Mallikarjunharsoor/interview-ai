import React from 'react'
import {useState} from 'react';
import {useNavigate, Link} from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const {handleRegister, loading} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({username, email, password});
    navigate('/login');
    }
    if(loading){
        return(<main><h1>Loading...</h1></main>)
    }
  return (
    <main>
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className='form-container'>
                <div className="input-container">
                    <label htmlFor="username">Username</label>
                    <input onChange={(e) => {setUsername(e.target.value)}} type="text" id="username" name="username" placeholder="Username" required />
                </div>
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => {setEmail(e.target.value)}} type="email" id="email" name="email" placeholder="Email" required />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => {setPassword(e.target.value)}} type="password" id="password" name="password" placeholder="Password" required />
                </div>
                <button className="btn register-btn" type="submit">Register</button>
            </form>
            <div className="isAccount">
                <p> Already have an account? <Link className="register-link" to="/login"> LogIn </Link></p>
            </div>
        </div>
    </main>
  )
}

export default Register
