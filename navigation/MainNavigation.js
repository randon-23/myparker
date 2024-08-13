import React from 'react';
import AuthStack from './authStack';
import BusinessStack from './businessStack';
import CustomerStack from './customerStack';
import { useAuth } from '../auth/AuthState.js';


const MainNavigator = () => {
    const { session, userData } = useAuth();

    if (!session || !userData) {
        // Show authentication screens if not logged in or userType is not fetched yet
        return <AuthStack />;
    }

    // if (!userData) {
    //     // You could show a loading spinner or placeholder while fetching user data
    //     return <LoadingScreen />;
    // }
    
    return userData.usertype === 'business' ? <BusinessStack /> : <CustomerStack />;
}

export default MainNavigator;