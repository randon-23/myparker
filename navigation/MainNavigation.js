import React, {useEffect} from 'react';
import AuthStack from './authStack';
import BusinessStack from './businessStack';
import CustomerStack from './customerStack';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { LoadingScreen } from '../components/screens/screens.js';

const MainNavigator = () => {
    const { user, userData, loading } = useAuth(); // Get user data and loading state from AuthContext
    const { updateTheme } = useTheme(); // Get the updateTheme function from ThemeContext. This function is used to update the theme based on the user's userType

    // Update the theme based on the user's userType when the userData is fetched and loading is complete
    useEffect(() => {
        if (!loading && userData) {
            updateTheme(userData.usertype);
        }
    }, [loading, userData]);

    // Check the authentication state and render the appropriate screens

    // If loading is true, a loading overlay is shown to bridge the gap between the authentication check and the rendering of the appropriate screens
    if (loading) {
        // Show a loading screen while checking authentication state
        return <LoadingScreen />;    
    }

    // If the user is not logged in, allo access to the authentication screens
    if (!user) {
        // Show authentication screens if not logged in or userType is not fetched yet
        return <AuthStack />;
    }

    // If the user is a business, allow access to the business screens
    if (userData && userData.usertype === 'business') {
        // Show business screens if user is a business
        return <BusinessStack />;
    }

    // If the user is a customer, allow access to the customer screens
    if(userData && userData.usertype === 'customer') {
        // Show customer screens if user is a customer
        return <CustomerStack />;
    }

    // Show authentication screens if userType is not fetched yet
    return <AuthStack />;
}

// Export the MainNavigator component which will be used as the root navigator in the App.js file
export default MainNavigator;