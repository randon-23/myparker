import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { requestCameraPermissions } from '../../services/LaunchService.js';
import { useAuth } from '../../contexts/AuthContext.js';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRCodeScannerScreen = ({ navigation }) => {
    const { user, userData } = useAuth();
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        requestCameraPermissions(setHasPermission);
    }, []);

    if (hasPermission === null) {
        return <Text>Checking camera permissions...</Text>;
    }

    if (hasPermission === false) {
        return (
            <View>
                <Text>Camera access is required to scan QR codes.</Text>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }) => {
        try {
            console.log('Scanned data:', data);
            // Process the scanned data based on the userType
            // if (userType === 'business') {
            //     // Business-specific logic
            //     onScanSuccess(data);
            // } else if (userType === 'customer') {
            //     // Customer-specific logic
            //     onScanSuccess(data);
            // }
        } catch (error) {
            console.log('FUCK')
            // onScanError(error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <QRCodeScanner
                onRead={handleBarCodeScanned} // 'onRead' is the correct prop for QRCodeScanner
                topContent={<Text style={styles.centerText}>Scan the QR code</Text>}
                bottomContent={<Text style={styles.centerText}>Align the QR code within the frame</Text>}
                style={{ flex: 1 }}
            />
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
    centerText: {
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
        padding: 20,
    },
});