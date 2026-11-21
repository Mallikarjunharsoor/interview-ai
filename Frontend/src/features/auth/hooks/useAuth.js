import { useContext } from 'react';

import { AuthContext } from '../auth.context';

import {
  login,
  register,
  logout
} from '../services/auth.services';


export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    setUser,
    loading,
    setLoading
  } = context;


  // LOGIN

  const handleLogin = async ({ email, password }) => {

    setLoading(true);

    try {

      const data = await login({ email, password });

      setUser(data.user);

      return data;

    } catch (error) {

      console.error(error);

      throw error;

    } finally {

      setLoading(false);

    }

  };


  // REGISTER

  const handleRegister = async ({ username, email, password }) => {

    setLoading(true);

    try {

      const data = await register({
        username,
        email,
        password
      });

      setUser(data.user);

      return data;

    } catch (error) {

      console.error(error);

      throw error;

    } finally {

      setLoading(false);

    }

  };


  // LOGOUT

  const handleLogout = async () => {

    setLoading(true);

    try {

      await logout();

      setUser(null);

    } catch (error) {

      console.error(error);

      throw error;

    } finally {

      setLoading(false);

    }

  };


  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout
  };

};