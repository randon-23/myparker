import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext()

export const useAuth = () => { return useContext(AuthContext) }

export const AuthProvider = ({ children }) => {
  // Define the user and userData state variables
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check the session on initial load
  useEffect(() => {
    // Function to check the session and set the user and userData state variables
    const checkSession = async () => {
      setLoading(true); // Set loading to true while checking the session, which will show a loading overlay in the app
      const { data } = await supabase.auth.getSession(); // Get the session data from Supabase

      // If the session exists, set the user and fetch the user data
      if (data.session) {
        setUser(data.session.user); // Set the user state variable to the obtained session user
        // Fetch user type or other user-related data
        supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id) // Select the user data where the user id matches the session user id. This is done to pipe the user data to the userData state variable, which in turn is destrucutred in the components to get the user data as part of Auth Context
          .single()
          .then(({ data }) => {
            setUserData(data);
            console.log('User data keys and values:');
            Object.entries(data).forEach(([key, value]) => {
              console.log(`${key}: ${value}`);
            });
          });
      }

      setLoading(false); // Set loading to false after checking the session, which will hide the loading overlay in the app
    };

    checkSession(); // Call the checkSession function on initial load

    // Event listener to check the session and set the user and userData state variables when the session changes.
    // This event listener will be triggered when the user signs in, signs out, or when the session is initialized.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true); // Set loading to true while checking the session, which will show a loading overlay in the app
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

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
        console.log('Cleaning up onAuthStateChange event listener');
        authListener.subscription.unsubscribe();
    };
  }, []);

  // Return the AuthContext.Provider with the user, userData, and loading state variables as the value
  return (
    <AuthContext.Provider value={{ user, userData, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;