import React from 'react';
import AuthStack from './authStack';
import BusinessStack from './businessStack';
import CustomerStack from './customerStack';
import { useAuth } from '../auth/AuthState.js';
import { LoadingScreen } from '../screens/screens.js';


const MainNavigator = () => {
    const { user, userData, loading } = useAuth();

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