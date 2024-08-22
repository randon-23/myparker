import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { fetchCustomerTickets, fetchBusinessTickets } from '../../services/QRCodeService';

const AllTicketsScreen = () => {
    const { userData } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTickets = async () => {
            setLoading(true);
            let result;

            if (userData.usertype === 'customer') {
                result = await fetchCustomerTickets(userData.id);
            } else if (userData.usertype === 'business') {
                result = await fetchBusinessTickets(userData.business_name);
            }

            if (result.success) {
                setTickets(result.data);
            } else {
                Alert.alert('Error', result.message);
            }

            setLoading(false);
        };

        loadTickets();
    }, [userData]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Loading tickets...</Text>
            </View>
        );
    }

    return (
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
