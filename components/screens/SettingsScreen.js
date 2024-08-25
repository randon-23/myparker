import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { Icon } from 'react-native-elements';
import { useAuthService } from '../../services/AuthService.js';
import { fetchActiveParking } from '../../services/QRCodeService.js';

const SettingsScreen = ({ navigation }) => {
    const { user, userData } = useAuth()
    const { logout } = useAuthService() // Import the logout function from the AuthService
    const [activeTicket, setActiveTicket] = useState(null); // State to store the active parking ticket data

    // Fetch the active parking ticket if the user is a customer on component mount
    useEffect(() => {
        if(userData.usertype === 'customer'){
            // Fetch the active parking ticket if the user is a customer
            // This is to conditionally render the View Acive Parking button, which is green if there is an active ticket and disabled if there is not
            const loadActiveParking = async () => {
                const result = await fetchActiveParking(userData);
    
                if (result.success) {
                    setActiveTicket(result.data); // If there is an active parking ticket, store it in the state
                } else {
                    if (result.message !== 'No active parking found') {
                        Alert.alert('Error', result.message);
                    }
                }
            };
    
            loadActiveParking(); // Call the function to fetch the active parking ticket
        }
    }, [userData]);

    // Function to handle the logout button press
    const handleLogout = async () => {
        try {
            const response = await logout(); // Call the logout function from the AuthService
            if(response.success){
                console.log('Logged out'); // If response is succesful, log out the user and navigate to the login screen
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
                {/* If user type is business display the Business QR Code button and View Active Parkings Button */}
                {/* If user type is customer display the Active Parking QR Code button and View Ticket History Button */}
                <View style={styles.menuOptionsContainer}>
                    {userData.usertype === 'business' ? (
                        <View>
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
                                onPress={() => navigation.navigate('AllTicketsScreen')}
                            >
                                <Icon
                                    name="car"
                                    type="font-awesome"
                                    size={24}
                                    color={'#FFF'}
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Your Business' Active Parkings</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    activeTicket ? { backgroundColor: 'lightgreen' } : { opacity: 0.5 }
                                ]}
                                onPress={() => navigation.navigate('CustomerLanding')}
                                disabled={!activeTicket}
                            >
                                <Icon
                                    name="qrcode"
                                    type="font-awesome"
                                    size={24}
                                    color={'#FFF'}
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Your Active Parking QR Code</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => navigation.navigate('AllTicketsScreen')}
                            >
                                <Icon
                                    name="car"
                                    type="font-awesome"
                                    size={24}
                                    color={'#FFF'}
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Your Parking Ticket History</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
        marginBottom: 40,
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
        flex: 1,
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