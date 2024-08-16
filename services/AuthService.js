import { supabase, supabaseAdmin } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthContext.js';

export const useAuthService = () => {
    const { setLoading } = useAuth();

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
    
            if (userError) throw new Error('User type mismatch or user not found');
            
            const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw new Error('Invalid email or password');
    
            return { success: true, session };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };
    
    const logout = async () => {
        setLoading(true);
        try{
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
    
            return { success: true };
        } catch(error){
            console.error('Logout error:', error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };
    
    const signup = async (formData) => {
        const { userType, contactName, contactSurname, email, password, contactPhoneNumber, customerLicensePlate, businessName } = formData;
        setLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.signUp({
                email,
                password,
            });
            console.log('pre error check')
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
    
            if (userInsertError) {
                // Attempt to clean up by deleting the user from the auth.users table
                const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
                if (deleteUserError) {
                    console.error('Failed to delete user after insertion error:', deleteUserError.message);
                }
                throw userInsertError; // Re-throw to be caught by the outer catch
            }
    
            return { success: true, user };
        } catch (error) {
            console.error('Signup error:', error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return { login, logout, signup };
}
