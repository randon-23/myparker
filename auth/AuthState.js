import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null)
    const [userData, setUserData] = useState(null)

    const fetchUserData = async (userId) => {
        const { data, error } = await supabase
          .from('users_plus')
          .select('*') // or just the fields you need
          .eq('id', userId)
          .single();
  
        if (error) {
          console.error('Error fetching user data:', error);
          return null;
        }
  
        return data;
      };
  
      const setAuthState = async (session) => {
        setSession(session);
        if (session?.user?.id) {
          const data = await fetchUserData(session.user.id);
          setUserData(data);
        }
    };
    
    useEffect(() => {
        // Get current session and set state
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthState(session);
        });
    
        // Listen for changes in authentication state
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthState(session);
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, [])

    return (
        <AuthContext.Provider value={{ session, userData }}>
          {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthProvider;