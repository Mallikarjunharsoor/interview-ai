import React from 'react'
import {useState} from 'react';
import {useNavigate, Link} from 'react-router';
import '../auth.style.scss';
import { useAuth } from '../hooks/useAuth'; 
const Login = () => {
    const {handleLogin, loading} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email, password});
        navigate('/');
    }
    if(loading){
        return(<main><h1>Loading...</h1></main>)
    }
  return (
    <main>
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className='form-container'>
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={(e) => {setEmail(e.target.value)}} id="email" name="email" placeholder="Email" required />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={(e) => {setPassword(e.target.value)}} id="password" name="password" placeholder="Password" required />
                </div>
                <button className="btn login-btn" type="submit">Login</button>
            </form>
            <div className="isAccount">
                <p> Don't have an account? <Link className="login-link" to="/register"> Create One</Link></p>
            </div>
        </div>
    </main>
  )
}

export default Login
