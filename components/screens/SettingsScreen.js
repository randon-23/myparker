import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { Icon } from 'react-native-elements';
import { useAuthService } from '../../services/AuthService.js';

const SettingsScreen = ({ navigation }) => {
    const { user, userData } = useAuth()
    const { logout } = useAuthService()
    console.log(userData)

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
            <ScrollView>
                {/* User Details Section */}
                <View style={styles.userDetailsContainer}>
                    <Text style={styles.header}>Your Account Details</Text>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>User Email:</Text>
                        <Text style={styles.detailText}>{user.email}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Primary Contact Name:</Text>
                        <Text style={styles.detailText}>{userData.contact_name}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Primary Contact Surname:</Text>
                        <Text style={styles.detailText}>{userData.contact_surname}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>User Type:</Text>
                        <Text style={styles.detailText}>{userData.usertype}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Phone Number:</Text>
                        <Text style={styles.detailText}>{userData.phone_number}</Text>
                    </View>
                </View>

                {/* Menu Options Section */}
                <View style={styles.menuOptionsContainer}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate('BusinessQRCode')}
                    >
                        <Icon
                            name="qrcode"
                            type="font-awesome"
                            size={24}
                            color={'#FFF'}
                            style={styles.optionIcon}
                        />
                        <Text style={styles.optionText}>Your Business QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionButton}
                        //onPress={() => navigation.navigate('UpdateProfile')}
                    >
                        <Icon
                            name="user"
                            type="font-awesome"
                            size={24}
                            color={'#FFF'}
                            style={styles.optionIcon}
                        />
                        <Text style={styles.optionText}>Update Profile Details</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.logoutButtonContainer}>
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
    },
    userDetailsContainer: {
        marginBottom: 40, // Adds spacing between user details and menu options
    },
    header: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10,
    },
    detailItem: {
        marginBottom: 15,
    },
    detailText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    detailLabel: {
        color: '#AAA',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userDetails: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    menuOptionsContainer: {
        flex: 1, // This will take up remaining space after user details
        justifyContent: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 10,
    },
    optionIcon: {
        marginRight: 15,
    },
    optionText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButtonContainer: {
        justifyContent: 'flex-end',
        paddingVertical: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        paddingVertical: 15,
        backgroundColor: '#FF0000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});