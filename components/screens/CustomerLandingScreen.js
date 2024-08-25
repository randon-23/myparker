import { supabase } from '../../lib/supabase.js';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from "../../contexts/ThemeContext.js";
import { Icon } from 'react-native-elements';
import { fetchActiveParking, completeParkingTicket } from '../../services/QRCodeService';
import QRCODE from '../elements/qrcode.js';

const CustomerLandingScreen = ({ navigation }) => {
    const { userData } = useAuth(); // Get the userData from the AuthContext
    const { theme } = useTheme(); // Get the theme from the ThemeContext
    const [activeTicket, setActiveTicket] = useState(null); // State to store the active ticket
    const [loading, setLoading] = useState(true); // State to track if the active ticket is loading

    // One time effect to fetch the active parking ticket
    useEffect(() => {
        // Handler function to fetch the active parking ticket
        const loadActiveParking = async () => {
            setLoading(true);
            const result = await fetchActiveParking(userData);
            setLoading(false);

            // If the result is successful, set the active ticket state to the data
            if (result.success) {
                setActiveTicket(result.data);
            } else {
                if (result.message !== 'No active parking found') {
                    Alert.alert('Error', result.message);
                }
            }
        };

        // Call the loadActiveParking function
        loadActiveParking();
    }, [userData]); // Run the effect when the userData changes

    // Effect to subscribe to parking status changes
    // This listens for changes to the parking_qr_codes table where the user_id is the current user's ID
    // This is enabled through the Supabase Realtime feature, where I enabled it in the parking_qr_codes table and filtered by user_id
    useEffect(() => {
        let subscription;

        // Susbcribe to parking status changes if there is an active ticket
        if (activeTicket?.status === 'active') {
            console.log('Subscribing to parking status changes');
            subscription = supabase.channel('parking-status-changes')
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'parking_qr_codes', filter: `user_id=eq.${userData.id}` },
                    (payload) => {
                        if (payload.new.status === 'validated' && payload.new.id === activeTicket.id) {
                            setActiveTicket(payload.new); // Update the ticket when status changes to validated
                            supabase.removeChannel(subscription); // Remove the subscription after the status changes, we only want to listen for one change. This is important even for scalability reasons.
                            console.log('Unsubscribed from parking status changes after ticket validation');
                        }
                    }
                )
                .subscribe();
        }

        // If there is not an active ticket, don't create a subscription.
        // If there is an active ticket, create a subscription and return a cleanup function which removes the subscription on component unmount
        return () => {
            console.log('Unsubscribing from parking status changes');
            if (subscription) {
                supabase.removeChannel(subscription); // Cleanup the subscription on component unmount
                console.log('Unsubscribed from parking status changes on cleanup');
            }
        };
    }, [activeTicket, userData]);

    // Handler function to complete the parking ticket, to override the console completion
    const handleCompletePress = async () => {
        // Call the service function to change the status of the current active ticket from validated to complete
        const result = await completeParkingTicket(activeTicket.id);
        if (result.success) {
            setActiveTicket(null); // Update the state to reflect the completed status
        } else {
            Alert.alert('Error', result.message);
        }
    };

    // If active ticket is still being fetched, show a loading message
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Checking for active parking...</Text>
            </View>
        );
    }

    // If there is an active ticket, show the active ticket details, otherwise show the welcome message
    // Along with the buttons to scan a QR code or view ticket history
    return (
        <View style={styles.container}>
            {activeTicket ? (
                <View style={styles.activeTicketContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Your Active Parking Ticket</Text>
                        <Text style={styles.message}>Show this QR code when exiting the car park.</Text>
                    </View>
            
                    <View style={styles.qrCodeContainer}>
                        <QRCODE value={activeTicket.qr_code} />
                        <Text style={[styles.subtitle, {marginTop: 15}]}>Location: {activeTicket.business_name}</Text>
                        <Text style={styles.subtitle}>Reference ID: {activeTicket.id}</Text>
                        {/* Corroborates change which is listened for by channel and adjusts ticket status to user*/}
                        <Text
                            style={[
                                styles.statusText,
                                { color: activeTicket.status === 'active' ? 'green' : 'royalblue' }
                            ]}
                        >
                            {activeTicket.status === 'active' ? 'ACTIVE' : 'VALIDATED'}
                        </Text>
                    </View>
                    
                    {/* The user can press this button to simulate completing the parking process and exiting the car park*/}
                    <View style={styles.statusContainer}>
                        {activeTicket.status === 'validated' && (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primaryColor, paddingHorizontal: 50, marginBottom: 50 }]}
                                onPress={handleCompletePress}
                            >
                                <Icon
                                    name="check"
                                    type='font-awesome'
                                    size={24}
                                    color={'#000'}
                                    style={{ marginRight: 10 }}
                                />
                                <Text style={[styles.buttonText, { color: theme.backgroundColor }]}>Override Console Completion</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                <>
                {/* Shows available options to this user type */}
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.title}>Welcome {userData.contact_name}!</Text>
                        <Text style={styles.subtitle}>
                            Before scanning, make sure to come to a <Text style={{ color: 'red' }}>complete stop!</Text>
                        </Text>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primaryColor }]}
                            onPress={() => navigation.navigate('QRCodeScanner')}
                        >
                            <Icon
                                name="qrcode"
                                type='font-awesome'
                                size={24}
                                color={'#000'}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.buttonText, { color: theme.textColor }]}>Scan Car Park QR Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primaryColor }]}
                            onPress={() => navigation.navigate('TicketsScreen')}
                        >
                            <Icon
                                name="history"
                                type='font-awesome'
                                size={24}
                                color={'#000'}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.buttonText, { color: theme.textColor }]}>View Ticket History</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export default CustomerLandingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        justifyContent: 'center',
    },
    welcomeContainer: {
        marginBottom: 40,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 5,
    },
    button: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 20,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center'
    },
    message: {
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
    },
    activeTicketContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerContainer: {
        alignItems: 'center',
    },
    qrCodeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusContainer: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
