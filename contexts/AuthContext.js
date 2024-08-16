import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext()

export const useAuth = () => { return useContext(AuthContext) }

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkSession = async () => {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
  
        if (data.session) {
          setUser(data.session.user);
          // Fetch user type or other user-related data
          supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
            .then(({ data }) => {
              setUserData(data);
              console.log('User data keys and values:');
              Object.entries(data).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
              });
            });
        }
  
        setLoading(false);
      };
  
      checkSession();
  
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setLoading(true);
        console.log('onAuthStateChange event triggered:', event, session);
        if(event === 'SIGNED_IN' || event === 'INITIAL_SESSION' && session){
          setUser(session.user)
          supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              setUserData(data);
            });
        } else if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserData(null);
        }
        setLoading(false);
      });
  
      return () => {
          console.log('Cleaning up onAuthStateChange event listener');
          authListener.subscription.unsubscribe();
      };
    }, []);

    return (
      <AuthContext.Provider value={{ user, userData, loading, setLoading }}>
        {children}
      </AuthContext.Provider>
    );
}

export default AuthProvider;