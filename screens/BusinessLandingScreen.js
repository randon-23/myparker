import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../auth/AuthState.js';
import { Button } from 'react-native-elements';
import { useAuthService } from '../auth/AuthService.js';

const BusinessLandingScreen = () => {
    const { userData } = useAuth();

    return (
        <View styles={styles.container}>
            <Text>BusinessLandingScreen</Text>
            <Text>Welcome {userData.business_name} - {userData.usertype}</Text>
        </View>
    );
}

export default BusinessLandingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        justifyContent: 'center',
    },
});