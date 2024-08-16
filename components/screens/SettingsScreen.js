import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { Icon } from 'react-native-elements';
import { useAuthService } from '../../services/AuthService.js';

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
            <View style={styles.content}>
                <Text style={styles.userDetails}>{user.email} - {userData.contact_name} - {userData.usertype}</Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    >
                        <Icon
                            name="sign-out"
                            type='font-awesome'
                            size={24}
                            color={'#FFF'}
                            style={{ marginRight: 10 }}
                            >
                        </Icon>
                        <Text
                            style={{color: '#FFF', fontSize: 18, fontWeight: 'bold'}}
                            >Logout
                        </Text>
                </TouchableOpacity>
            </View>
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
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    userDetails: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    footer: {
        justifyContent: 'flex-end',
    },
    logoutButton: {
        flexDirection: 'row',
        paddingVertical: 15,
        backgroundColor: '#FF0000',
        borderRadius: 5,
        justifyContent: 'center'
    }
});