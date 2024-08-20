import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import { requestCameraPermissions } from '../../services/LaunchService.js';
import { verifyBusinessQRCode } from '../../services/QRCodeService.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { Camera, CameraView } from 'expo-camera';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

const QRCodeScannerScreen = ({ navigation }) => {
    const { userData } = useAuth();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        requestCameraPermissions(setHasPermission);
    }, []);

    if (hasPermission === null) {
        return <Text>Checking camera permissions...</Text>;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>Camera access is required to scan QR codes.</Text>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }) => {
        if (!scanned) {
            setScanned(true);

            // data is the scanned QR code value, userData is the user's data from the AuthContext
            const result = await verifyBusinessQRCode(data, userData);

            if (result.success) {
                Alert.alert(
                    'Success',
                    result.message,
                    [{ text: 'OK', onPress: () => navigation.navigate('CustomerLanding') }]
                );
            } else {
                Alert.alert(
                    'Error',
                    `${result.message} - Press OK to scan again.`,
                    [{ text: 'OK', onPress: () => setScanned(false) }]
                );
            }
        }
    };

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