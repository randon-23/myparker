import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import { requestCameraPermissions } from '../../services/LaunchService.js';
import { verifyBusinessQRCode, validateCustomerParkingQRCode } from '../../services/QRCodeService.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { CameraView } from 'expo-camera';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

//Common component for scanning QR codes - CameraView is a custom component that wraps the Expo Camera component
const QRCodeScannerScreen = ({ navigation }) => {
    const { userData } = useAuth(); // Get the user data from the AuthContext
    const [hasPermission, setHasPermission] = useState(null); // State to get and store camera permissions
    const [scanned, setScanned] = useState(false); // State to track if a QR code has been scanned

    // One time effect to check camera permissions have been already granted
    useEffect(() => {
        requestCameraPermissions(setHasPermission);
    }, []);

    // If permissions are still being checked, show a loading message
    if (hasPermission === null) {
        return <Text>Checking camera permissions...</Text>;
    }

    // If permissions are denied, show a message to the user and do not render the camera view
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>Camera access is required to scan QR codes.</Text>
            </View>
        );
    }
    
    // Handler function which executes functionaliyu depending on the user type. Data prop is scanned QR code value
    const handleBarCodeScanned = async ({ data }) => {
        if (!scanned) {
            setScanned(true);

            if(userData.usertype === 'customer'){
                // data is the scanned QR code value, userData is the user's data from the AuthContext
                const result = await verifyBusinessQRCode(data, userData); // Call the service function to verify the QR code, which finds the business name and checks if the user has an active ticket

                // Show an alert based on the result of the verification
                if (result.success) {
                    Alert.alert(
                        'Success',
                        result.message,
                        [{ text: 'OK', onPress: () => navigation.push('CustomerLanding') }]
                    );
                } else {
                    Alert.alert(
                        'Error',
                        `${result.message} - Press OK to scan again.`,
                        [{ text: 'OK', onPress: () => setScanned(false) }]
                    );
                }
            } else if(userData.usertype === 'business') {
                const result = await validateCustomerParkingQRCode(data, userData); // Call the service function to validate the customer's parking ticket

                // Show an alert based on the result of the validation
                if(result.success) {
                    Alert.alert(
                        'Success',
                        result.message,
                        [{ text: 'OK', onPress: () => navigation.push('BusinessLanding') }]
                    );
                } else {
                    Alert.alert(
                        'Error',
                        `${result.message} - Press OK to scan again.`,
                        [{ text: 'OK', onPress: () => setScanned(false) }]
                    );
                }
            }
        }
    };

    // Render the CameraView component with the barcode scanner settings along with the overlay for the QR code frame
    return (
        <View style={{ flex: 1 }}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.overlay}>
                <Text style={styles.instructionText}>Align the QR code within the frame</Text>
                <View style={styles.qrFrame} />
            </View>
        </View>
    );
};

export default QRCodeScannerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    qrFrame: {
        width: qrSize,
        height: qrSize,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 10,
    },
});