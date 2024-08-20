import { supabase } from '../lib/supabase.js'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { Share } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
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
    } catch (error) {
        throw new Error(`Unexpected error in fetchQRCode: ${error.message}`);
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
        throw new Error('Failed to generate business QR code');
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

function generateUniqueParkingString(userId){
    const randomString = uuidv4(); // UUID with dashes, 36 characters
    return `${userId}-${randomString}`;
}

// Function to download the QR code as a image file to device
// Interacts with the device's file system and media library, client-side only
export async function downloadQRCode(qrCodeRef, userData) {
    try{
        if (qrCodeRef.current) {
            qrCodeRef.current.toDataURL(async (dataURL) => {
                const fileName = `${userData.business_name}_qrcode.png`;
    
                // Create a file path in the Downloads directory
                const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
                try {
                    // Save the file
                    await FileSystem.writeAsStringAsync(filePath, dataURL, {
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
    
                    Alert.alert('Success', `QR Code has been saved to Gallery`);
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

export async function shareQRCode(qrCodeRef, userData) {
    try{
        if (qrCodeRef.current) {
            qrCodeRef.current.toDataURL(async (dataURL) => {
                try {
                    const fileName = `${userData.business_name}_qrcode.png`;

                    // Create a temporary file path to store the image
                    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
                    // Save the file
                    await FileSystem.writeAsStringAsync(filePath, dataURL, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
    
                    // Use the Share API to open the share dialog
                    await Share.share({
                        url: filePath,
                        title: `${userData.business_name} QR Code`,
                        message: 'Check out this QR code!',
                    });
    
                } catch (error) {
                    Alert.alert('Error', 'Failed to share QR code.');
                }
            });
        } else {
            Alert.alert('Error', 'QR code not found.');
        }
    } catch(error){
        Alert.alert('Error encountered =>', error.message);
    }
}

// userData is the user's data from the AuthContext
// qrCodeValue is the scanned QR code value
// data in if(data) block is the data from the database
export async function verifyBusinessQRCode(businessQRCodeValue, userData) {
    try{
        // Fetch the business name from the database using the scanned QR code value to verify
        const { data, error } = await supabase
            .from('business_qr_codes')
            .select('business_name')
            .eq('qr_code', businessQRCodeValue)
            .single();

        if(error) {
            throw new Error('An error occurred while verifying the QR Code data');
        }

        if(data) {
            // Generate parking QR Code
            const result = await generateParkingQRCode(data.business_name, userData);

            if(!result.success) {
                // If generation of parking QR code erroneous, return error message from source to be handled in client side handler and displayed in alert
                return result
            }

            // Return success message to be handled in client side handler and displayed in alert
            return { success: true, message: `QR Code verified Welcome to ${data.business_name} car park!` }
        } else {
            return { success: false, message: 'QR Code not found' }
        }
    } catch(error){
        return { success: false, message: error.message}
    }
}

function generateUniqueParkingString(userId){
    const randomString = uuidv4(); // UUID with dashes, 36 characters
    return `${userId}-${randomString}`;
}

async function generateParkingQRCode(businessName, userData){
    try {
        const qrCode = generateUniqueParkingString(userData.id);

        const { data, error } = await supabase
            .from('parking_qr_codes')
            .insert([
                { 
                    user_id: userData.id, // User ID of customer
                    business_name: businessName, // Business name of car park where parking is reserved
                    qr_code: qrCode, // Unique QR code for parking reservation
                    status: 'active', // Status of parking reservation - set to 'active' by default
                },
            ])
            .single();

        if (error) {
            return { success: false, message: `An error occurred while generating the parking QR code - ${error}` };
        }

        return { success: true };
    } catch (error) {
        return { success: false, message: `An unexpected error occurred while generating the parking QR code - ${error}` };
    }
}