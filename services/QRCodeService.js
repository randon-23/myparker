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

// Function to generate a unique string based on the identifier. Identifier is either business name in case of businesses or user ID in case of customers
// Returns a string, does not interact with the database, helper function
function generateUniqueString(identifier) {
    // Create a unique string using the business name and a random alphanumeric string
    // https://www.youtube.com/watch?v=R9PpdFt2ygM
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const length = 32

    let result = ''
    
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return `${identifier}-${result}`;
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

export async function validateCustomerParkingQRCode(parkingQRCodeValue, userData) {
    try{
        const {data, error } = await supabase
            .from('parking_qr_codes')
            .select('*')
            .eq('qr_code', parkingQRCodeValue)
            .eq('status', 'active')
            .eq('business_name', userData.business_name)
            .single();
        
        if(error){
            if(error.details === "The result contains 0 rows"){
                return { success: false, message: 'An unexpected error when validating parking (pre-status update)' };
            }
        }

        if(data){
            // Update the status of the parking QR code to 'validated'
            const { data: updatedData, error: updateError } = await supabase
                .from('parking_qr_codes')
                .update({ status: 'validated' })
                .eq('id', data.id)
                .single();

            if(updateError){
                return { success: false, message: `An error occurred while updating the parking status - ${updateError}` };
            }

            return { success: true, message: 'Parking validated' };
        }
    } catch(error){
        return { success: false, message: error.message}
    }
}

async function generateParkingQRCode(businessName, userData){
    try {
        const qrCode = generateUniqueString(userData.id);

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

// Ticket screens
export async function fetchActiveParking(userData) {
    try{
        const { data, error } = await supabase
            .from('parking_qr_codes')
            .select('*')
            .eq('user_id', userData.id)
            .in('status', ['active', 'validated'])
            .single(); //Retrieve active user ticket - ticket is considered active if its status is not 'complete'

        if(error){
            if(error.details === "The result contains 0 rows"){
                return { success: false, data: null, message: 'No active parking found' };
            }
        }

        return { success: true, data };
    } catch(error){
        return { success: false, message: `An error occurred while fetching active parking - ${error.message}` };
    }
}

export async function fetchTicketData(userData) {
    try {
        let query;
        
        if (userData.usertype === 'customer') {
            query = supabase
                .from('parking_qr_codes')
                .select('*')
                .eq('user_id', userData.id);
        } else if (userData.usertype === 'business') {
            query = supabase
                .from('parking_qr_codes')
                .select('*')
                .eq('business_name', userData.business_name)
                .eq('status', 'active');
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, message: `An error occurred while fetching ticket data - ${error.message}` };
    }
}

//Used to override console verification on exit of car park
export async function completeParkingTicket(ticketID){
    try{
        const { data, error } = await supabase
            .from('parking_qr_codes')
            .update({ status: 'complete' })
            .eq('id', ticketID)
            .single();

        if(error){
            return { success: false, message: `An error occurred while completing the parking ticket - ${error}` };
        }

        return { success: true };
    } catch(error){
        return { success: false, message: `An unexpected error occurred while completing the parking ticket - ${error}` };
    }
}

// Fetch all tickets for a customer
export async function fetchCustomerTickets(userId) {
    try {
        const { data, error } = await supabase
            .from('parking_qr_codes')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            return { success: false, message: `An error occurred while fetching tickets - ${error.message}` };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, message: `An unexpected error occurred while fetching tickets - ${error.message}` };
    }
}

// Fetch all tickets for a business
export async function fetchBusinessTickets(businessName) {
    try {
        const { data, error } = await supabase
            .from('parking_qr_codes')
            .select('*')
            .eq('business_name', businessName)
            .in('status', ['active', 'validated']);

        if (error) {
            return { success: false, message: `An error occurred while fetching business tickets - ${error.message}` };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, message: `An unexpected error occurred while fetching business tickets - ${error.message}` };
    }
}