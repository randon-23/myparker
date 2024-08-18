import React, {useEffect} from 'react';
import AuthStack from './authStack';
import BusinessStack from './businessStack';
import CustomerStack from './customerStack';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { LoadingScreen } from '../components/screens/screens.js';

const MainNavigator = () => {
    const { user, userData, loading } = useAuth();
    const { updateTheme } = useTheme();

    useEffect(() => {
        if (!loading && userData) {
            updateTheme(userData.usertype);
        }
    }, [loading, userData]);

    if (loading) {
        // Show a loading screen while checking authentication state
        return <LoadingScreen />;    
    }

    if (!user) {
        // Show authentication screens if not logged in or userType is not fetched yet
        return <AuthStack />;
    }

    if (userData && userData.usertype === 'business') {
        // Show business screens if user is a business
        return <BusinessStack />;
    }

    // Show customer screens if user is a customer
    if(userData && userData.usertype === 'customer') {
        return <CustomerStack />;
    }

    // Show authentication screens if userType is not fetched yet
    return <AuthStack />;
}

export default MainNavigator;