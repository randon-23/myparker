import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const QRCODE = ({ value, getRef }) => {
    return (
        <QRCode
            value={value}
            size={250}
            color="black"
            backgroundColor="white"
            getRef={getRef}  // Attach the ref passed down from the parent component
        />
    );
}

export default QRCODE;