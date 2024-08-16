import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../auth/AuthState.js';
import { Button } from 'react-native-elements';
import { useAuthService } from '../auth/AuthService.js';

const SettingsScreen = () => {
    const { user, userData } = useAuth()
    const { logout } = useAuthService()

    const handleLogout = async () => {
        try {
            const response = await logout();
            if(response.success){
                console.log('Logged out');
            } else {
                console.log('Error logging out');
                Alert.alert(`Error logging out: ${response.error}`);
            }
        } catch (error) {
            console.log('Error logging out');
        }
    }

    return (
        <View style={styles.container}>
            <Text>{user.email} - {userData.contact_name} - {userData.usertype}</Text>
            <Button
                title="Logout"
                onPress={handleLogout}
                >
            </Button>
        </View>
    )
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        justifyContent: 'center',
    }
});