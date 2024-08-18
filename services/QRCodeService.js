import { supabase } from '../lib/supabase.js'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

//This is not wrapped in a function like AuthService because it is does not need to influence global state or

// Function to fetch an existing QR code for a business from the database
// Interacts with the database and returns a string
export async function fetchQRCode(businessName) {
    try {
        const { data, error } = await supabase
            .from('business_qr_codes')
            .select('qr_code')
            .eq('business_name', businessName)
            .single();

        if (error) {
            console.log(`No QR code found for business: ${businessName}`);
            return null;  // Return null if there's an error, treating it as no QR code found
        }

        return data.qr_code;
    } catch (err) {
        console.error('Unexpected error in fetchQRCode:', err);
    }
}

// Function to generate a unique QR code string and store it in the database
// Interacts with the database and returns a string
export async function generateQRCode(businessName) {
    const uniqueString = generateUniqueString(businessName);

    // Insert the generated QR code string into the Supabase table
    const { data, error } = await supabase
        .from('business_qr_codes')
        .insert([{ business_name: businessName, qr_code: uniqueString }])
        .single();

    if (error) {
        console.error('Error inserting QR code into database:', error);
        throw new Error('Failed to generate QR code');
    }

    // Return the generated QR code string
    return data.qr_code;
}

// Function to generate a unique string based on the business name
// Returns a string, does not interact with the database, helper function
function generateUniqueString(businessName) {
    // Create a unique string using the business name and a random alphanumeric string
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${businessName}-${randomString}`;
}

// Function to download the QR code as a image file to device
// Interacts with the device's file system and media library, client-side only
export async function downloadQRCode(qrCodeRef, userData) {
    try{
        if (qrCodeRef.current) {
            qrCodeRef.current.toDataURL(async (dataURL) => {
                const base64Code = `data:image/png;base64,${dataURL}`;
                const fileName = `${userData.business_name}_qrcode.png`;
    
                // Create a file path in the Downloads directory
                const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
                try {
                    // Save the file
                    await FileSystem.writeAsStringAsync(filePath, base64Code, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
    
                    // Save to Media Library (which includes the Downloads directory on Android)
                    const asset = await MediaLibrary.createAssetAsync(filePath);
                    const album = await MediaLibrary.getAlbumAsync('QR Codes');
                    
                    if (album == null) {
                        await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
                    } else {
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }
    
                    Alert.alert('Success', `QR Code has been saved to your Images -> QR Codes folder.`);
                } catch (error) {
                    Alert.alert('Error', 'Failed to download QR code.');
                }
            });
        } else {
            Alert.alert('Error', 'QR code not found.');
        }
    } catch(error){
        Alert.alert('Error encountered =>', error.message);
    }
}