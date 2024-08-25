import { supabase, supabaseAdmin } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';

export const useAuthService = () => {
    const { setLoading } = useAuth();
    const { updateTheme } = useTheme();

    const login = async (email, password, userType) => {
        setLoading(true);
        try {
            //Query users table to check user type
            const { error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .eq('usertype', userType)
                .single();
            
            // If the user type doesn't match, throw an error
            if (userError) throw new Error('Account is not of selected type');
            
            // Proceed with authentication using email and password
            const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw new Error('Invalid email or password');
            
            // Update the theme based on the user type
            updateTheme(userType)

            // Return the session if no errors are thrown, which will be used to authenticate future requests and contains the user's data and their bearer token
            return { success: true, session };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle user logout
    const logout = async () => {
        setLoading(true);
        try{
            // Sign the user out from Supabase authentication
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Reset the theme to the default (customer) after logout
            updateTheme('customer')

            // Return success if no errors are thrown
            return { success: true };
        } catch(error){
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle user signup
    const signup = async (formData) => {
        // Destructure the form data sent from the signup form
        const { userType, contactName, contactSurname, email, password, contactPhoneNumber, customerLicensePlate, businessName } = formData;
        setLoading(true);
        try {
            // Sign up the user with Supabase authentication using email and password
            // This will create a user in the auth.users table
            const { data: { user }, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            console.log('Supabase initial sign up complete')
    
            //Server side validation for common fields
            if (!contactName || !contactSurname || !email || !password || !contactPhoneNumber) {
                throw new Error('All fields are required');
            }
    
            // Additional validation based on userType
            if (userType === 'customer' && !customerLicensePlate) {
                throw new Error('Customer license plate is required');
            }
            if (userType === 'business' && !businessName) {
                throw new Error('Business name is required');
            }
    
            // Insert user data into the 'users' table
            // This will create a record in the users table with the user's additional data
            const { error: userInsertError } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: email,
                    usertype: userType,
                    contact_name: contactName,
                    contact_surname: contactSurname,
                    business_name: userType === 'business' ? businessName : null,
                    license_plate: userType === 'customer' ? customerLicensePlate : null,
                    phone_number: contactPhoneNumber,
                });
    
            // If there was an error inserting user data into 'users', attempt to delete the user from auth
            if (userInsertError) {
                // Attempt to clean up by deleting the user from the auth.users table
                const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
                if (deleteUserError) {
                    console.log('Failed to delete user after insertion error:', deleteUserError.message);
                }
                throw userInsertError; // Re-throw to be caught by the outer catch
            }
    
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return { login, logout, signup };
}
