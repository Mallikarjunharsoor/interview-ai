import { createContext, useEffect, useState } from 'react';
import { getme } from './services/auth.services';
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
   
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSetUser = async () => {
            try{
                const data = await getme();
                setUser(data.user);
            } catch(err){
                console.error(err);
                setUser(null);
            } finally{
                setLoading(false);
            }
        }
        getSetUser();
    }, []);

    return(
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
        {children}
        </AuthContext.Provider>
    )
}