import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../auth/AuthState.js';
import { Button, Icon } from 'react-native-elements';

const CustomerLandingScreen = () => {
    const { userData } = useAuth();
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome {userData.contact_name}!</Text>
            <Text style={styles.subtitle}>Before scanning, make sure to come to a <Text style={{color: 'red'}}>complete stop!</Text></Text>

            <Button
                title="Scan Car Park QR Code"
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                icon={
                    <Icon
                        name="qrcode"
                        type='font-awesome'
                        size={24}
                        color={'#000'}
                        style={{ marginRight: 10 }}
                    >
                    </Icon>
                }
                >
            </Button>
        </View>
    );
}

export default CustomerLandingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonTitle: {
        color: '#000',
    },
});