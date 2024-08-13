import { supabase, supabaseAdmin } from '../lib/supabase.js';

const login = async (email, password, userType) => {
    try {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        //Query users table to check user type
        const { data: user, error: userError } = await supabase
            .from('users_plus')
            .select('usertype')
            .eq('id', session.user.id)
            .single();

        if (userError) throw userError;

        if (user.usertype !== userType) {
            throw new Error('User type does not match');
        }

        return { success: true, session };
    } catch (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
    }
};

const signup = async (formData) => {
    const { userType, contactName, contactSurname, email, password, contactPhoneNumber, customerLicensePlate, businessName } = formData;
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
    }
};

export default { login, signup };
