import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from "../../contexts/ThemeContext.js";
import { Icon } from 'react-native-elements';

const BusinessLandingScreen = ({ navigation }) => {
    const { userData } = useAuth();
    const { theme } = useTheme();
   
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome {userData.business_name}!</Text>
            <Text style={styles.subtitle}>To scan a customer's parking QR Code, press the button below!</Text>

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
                >
                </Icon>
                <Text style={[styles.buttonText, { color: theme.backgroundColor }]}>Scan Customer QR Code</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>To generate, or view your already generated QR Code which customers will scan, press the button below!</Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primaryColor }]}
                onPress={() => navigation.navigate('BusinessQRCode')}
                >
                <Icon
                    name="briefcase"
                    type='font-awesome'
                    size={24}
                    color={'#000'}
                    style={{ marginRight: 10 }}
                >
                </Icon>
                <Text style={[styles.buttonText, { color: theme.backgroundColor }]}>View/Generate Business QR Code</Text>
            </TouchableOpacity>
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
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 20,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
    }
});