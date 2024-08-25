import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from "../../contexts/ThemeContext.js";
import { Icon } from 'react-native-elements';
import * as MediaLibrary from 'expo-media-library';
import { generateQRCode, fetchQRCode, downloadQRCode, shareQRCode } from '../../services/QRCodeService.js';
import QRCODE from '../elements/qrcode.js';

const BusinessQRCodeScreen = () => {
    const { user, userData } = useAuth();
    const { theme } = useTheme();
    const [qrCode, setQrCode] = useState(null);
    const qrCodeRef = useRef();

    // Fetch the QR code from the database on component mount
    useEffect(() => {
        // Fetch the QR code from the database if it exists
        fetchQRCodeFromDB();
    }, []);

    //Handler functions for fetching, generating and downloading the QR code
    const fetchQRCodeFromDB = async () => {
        try {
            const qrCodeString = await fetchQRCode(userData.business_name);
            if(!qrCodeString) {
                console.log('No QR code found in the database, prompting user to generate one...');
                return
            }
            setQrCode(qrCodeString);
        } catch (error) {
            Alert.alert('Error encountered =>', error.message);
        }
    }

    // Handler function to generate a new QR code if the business user does not have one
    const handleGenerateQRCode = async () => {
        try {
            // Generate a new QR code by calling the service function
            await generateQRCode(userData.business_name);
            const newQRCode = await fetchQRCode(userData.business_name);
            setQrCode(newQRCode);
        } catch (error) {
            Alert.alert('Error encountered =>', error.message);
        }
    }

    // Handler function to download the QR code upon pressing the Download QR Code button
    const handleDownloadQRCode = async () => {
        // Check if the app has permission to access the media library
        const { status } = await MediaLibrary.getPermissionsAsync();

        if (status !== 'granted') {
            // If permissions are not granted, show an alert explaining why
            Alert.alert(
                'Permission Required',
                'We need permission to access your media library to save QR codes. Would you like to grant this permission?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Grant Permission',
                        onPress: async () => {
                            // Request permission
                            const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                            if (newStatus === 'granted') {
                                await downloadQRCode(qrCodeRef, userData); // Call actual download function if permission is granted
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            // If permissions are already granted, proceed with downloading the QR code
            await downloadQRCode(qrCodeRef, userData);
        }
    }

    // Handler function to share the QR code upon pressing the Share QR Code button
    const handleShareQRCode = async () => {
        await shareQRCode(qrCodeRef, userData.business_name); // Call the service function to share the QR code, which essentially allows user to share the QR code image to other apps on the device
    }

    return (
        <View style={styles.container}>
            {/* If a QR code is found in the database, display it along with the share and download buttons */}
            {qrCode ? (
                <View style={styles.qrContainer}>
                    <Text style={styles.businessName}>{userData.business_name}'s Business QR Code</Text>
                    <Text style={styles.instructions}>
                        Please set this QR code on the wall or the console at the entry of your car park.
                    </Text>
                    <QRCODE 
                        value={qrCode}
                        getRef={qrCodeRef}
                    />
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primaryColor }]}
                        onPress={handleShareQRCode} // Handler to share the QR code
                    >
                        <Icon
                            name="share-alt"
                            type="font-awesome"
                            size={24}
                            color={theme.textColor}
                            style={styles.icon}
                        />
                        <Text style={[styles.buttonText, { color: theme.textColor }]}>Share QR Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primaryColor }]}
                        onPress={handleDownloadQRCode}  // Handler to download the QR code
                    >
                        <Icon
                            name="download"
                            type="font-awesome"
                            size={24}
                            color={theme.textColor}
                            style={styles.icon}
                        />
                        <Text style={[styles.buttonText, { color: theme.textColor }]}>Download QR Code</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // If fetchQRCodeFromDB() does not find a QR code in the database, prompt the user to generate one
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primaryColor }]}
                    onPress={handleGenerateQRCode}
                >
                    <Icon
                        name="qrcode"
                        type="font-awesome"
                        size={24}
                        color={theme.textColor}
                        style={styles.icon}
                    />
                    <Text style={[styles.buttonText, { color: theme.textColor }]}>Generate QR Code</Text>
                </TouchableOpacity>
            )}
        </View>
    );

}

export default BusinessQRCodeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    qrContainer: {
        alignItems: 'center',
    },
    businessName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',  // Adjust to match your theme
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        color: '#AAA',  // Adjust to match your theme
        textAlign: 'center',
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 18,
    },
});