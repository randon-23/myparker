import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { fetchCustomerTickets, fetchBusinessTickets } from '../../services/QRCodeService';

// Component to display all tickets for a user - customer or business
const AllTicketsScreen = () => {
    const { userData } = useAuth(); // Get the user data from the AuthContext
    const [tickets, setTickets] = useState([]); // State to store the tickets, initialized as an empty array
    const [loading, setLoading] = useState(true); // State to track if the tickets are being loaded

    // One time effect to fetch the tickets based on the user's userType
    useEffect(() => {
        // Function to fetch the tickets based on the user's userType
        const loadTickets = async () => {
            setLoading(true); // Set loading to true while fetching the tickets - to show a loading message
            let result;

            if (userData.usertype === 'customer') {
                result = await fetchCustomerTickets(userData.id); // Pass the customer ID to fetch the tickets
            } else if (userData.usertype === 'business') {
                result = await fetchBusinessTickets(userData.business_name); // Pass the business name to fetch the tickets
            }

            if (result.success) {
                setTickets(result.data); // Set the tickets in the state
            } else {
                Alert.alert('Error', result.message); // Display an alert if there is an error fetching the tickets
            }

            setLoading(false); // Set loading to false after fetching the tickets
        };

        // Call the loadTickets function when the component mounts
        loadTickets();
    }, [userData]);

    // View shown while loading the tickets
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Loading tickets...</Text>
            </View>
        );
    }

    // View shown when the tickets are loaded
    return (
        // ScrollView to allow scrolling if the content exceeds the screen height, if no tickets are found, a message is displayed
        <ScrollView style={styles.container}>
            <Text style={styles.title}>All Parking Tickets</Text>
            {tickets.length > 0 ? (
                tickets.map((ticket) => (
                    <View key={ticket.id} style={styles.ticketContainer}>
                        <Text style={styles.ticketText}>Location: {ticket.business_name}</Text>
                        <Text style={styles.ticketText}>Status: {ticket.status}</Text>
                        <Text style={styles.ticketText}>Reference ID: {ticket.id}</Text>
                        <Text style={styles.ticketText}>Created At: {new Date(ticket.created_at).toLocaleString()}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.message}>No tickets found.</Text>
            )}
        </ScrollView>
    );
};

export default AllTicketsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    ticketContainer: {
        backgroundColor: '#222',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    ticketText: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 5,
    },
    message: {
        color: '#777',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});
