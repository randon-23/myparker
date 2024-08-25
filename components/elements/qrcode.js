import React from 'react';
import QRCode from 'react-native-qrcode-svg';

// QRCODE component - generates a QR code based on the value passed in
// Uses the react-native-qrcode-svg library to generate the QR code image
const QRCODE = ({ value, getRef }) => {
    return (
        <QRCode
            value={value} // Value to encode in the QR code
            size={250}
            color="white" // Color of the QR code
            backgroundColor="black" // Background color of the QR code - on a black background, the QR code will be white- if not, scanning will be inconsistent at best
            getRef={getRef}  // Attach the ref passed down from the parent component
        />
    );
}

export default QRCODE;