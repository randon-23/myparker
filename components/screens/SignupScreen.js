import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthService } from '../../services/AuthService';
import { useTheme } from '../../contexts/ThemeContext';

const SignupScreen = ({ navigation }) => {
    //This is a user type that will determine the state of the login screen
    const [userType, setUserType] = useState('customer');
    //All common to both user types
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactSurname, setContactSurname] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');

    //User type specific fields
    const [customerLicensePlate, setCustomerLicensePlate] = useState('');
    const [businessName, setBusinessName] = useState('');

    const { theme, updateTheme } = useTheme();
    const { signup } = useAuthService();

    // Function to reset all fields upon changing user type
    const resetFields = () => {
        setEmail('');
        setPassword('');
        setContactName('');
        setContactSurname('');
        setContactPhoneNumber('');
        setCustomerLicensePlate('');
        setBusinessName('');
    };

    {/* Validation Functions */}
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateLicensePlate = (licensePlate) => {
        const re = /^[A-Z]{3}-\d{3}$/;
        return re.test(licensePlate);
    };

    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber.length > 0;
    };

    const handleSignup = async () => {
        // Client-side validation before making the signup request
        if (userType === 'customer') {
            if (!contactName || !contactSurname || !validateEmail(email) || !validatePassword(password) || !validateLicensePlate(customerLicensePlate) || !validatePhoneNumber(contactPhoneNumber)) {
                alert('Please fill in all fields!');
                return;
            }
        } else {
            if (!contactName || !contactSurname || !validateEmail(email) || !validatePassword(password) || !businessName || !validatePhoneNumber(contactPhoneNumber)) {
                alert('Please fill in all fields!');
                return;
            }
        }
    
        // Data to be sent to the AuthService signup function
        const formData = {
            userType,
            contactName,
            contactSurname,
            email,
            password,
            contactPhoneNumber,
            customerLicensePlate,
            businessName,
        };
    
        try {
            // Attempt to sign up the user
            const response = await signup(formData);
    
            if (response.success) {
                Alert.alert(
                    'Signup Successful!',
                    '',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('Login') }
                    ]
                );
            } else {
                // Display server error message if signup failed depending on error message
                if(response.error.includes(`duplicate key value violates unique constraint "users_license_plate_key"`)) {
                    alert(`Signup failed - License plate already exists`)
                } else if(response.error.includes(`duplicate key value violates unique constraint "users_phone_number_key"`)){
                    alert(`Signup failed - Phone number already exists`)
                } else if(response.error.includes(`User already registered`)){
                    alert(`Signup failed - User already exists`)
                } else if(response.error.includes(`duplicate key value violates unique constraint "users_business_name_key"`)){
                    alert(`Signup failed - Business already exists`)
                }
            }
        } catch (error) {
            // Catch any unexpected errors during the signup process
            console.error(`Signup failed due to unexpected error: ${error.message}`);
            alert(`Signup failed due to unexpected error: ${error.message}`);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor}]}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Choose Account type and fill in fields</Text>

            {/* Segmented Control */}
            <View style={styles.segmentedControl}>
                <TouchableOpacity
                    onPress={() => {
                        setUserType('customer');
                        updateTheme('customer');
                        resetFields();
                    }}
                    style={[
                    styles.segmentedButton,
                    userType === 'customer' && {backgroundColor: theme.primaryColor},
                    {borderColor: theme.primaryColor}
                    ]}
                >
                    <Text style={[{ color: userType === 'customer' ? '#000' : theme.primaryColor }]}>
                    Customer
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setUserType('business')
                        updateTheme('business');
                        resetFields();
                    }}
                    style={[
                    styles.segmentedButton,
                    userType === 'business' && { backgroundColor: theme.primaryColor },
                    {borderColor: theme.primaryColor}
                    ]}
                >
                    <Text style={[{ color: userType === 'business' ? '#000' : theme.primaryColor }]}>
                    Business
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Sign up Form Conditional Fields Based on User Type */}
            {userType === 'customer' ? (
                <>
                    <View style={styles.inputContainer}>
                        <Icon name="person-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={contactName}
                            onChangeText={setContactName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="person-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Surname"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={contactSurname}
                            onChangeText={setContactSurname}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="mail-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    {!validateEmail(email) && email !== '' && (
                        <Text style={styles.errorText}>Please enter a valid email</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Icon name="lock-closed-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    {!validatePassword(password) && password !== '' && (
                        <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Icon name="car-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="License Plate Number (format ABC-123)"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={customerLicensePlate}
                            onChangeText={setCustomerLicensePlate}
                        />
                    </View>
                    {!validateLicensePlate(customerLicensePlate) && customerLicensePlate !== '' && (
                        <Text style={styles.errorText}>License plate format must be ABC-123</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Icon name="call-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={contactPhoneNumber}
                            onChangeText={setContactPhoneNumber}
                        />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.inputContainer}>
                        <Icon name="person-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Primary Contact Name"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={contactName}
                            onChangeText={setContactName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="person-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Primary Contact Surname"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={contactSurname}
                            onChangeText={setContactSurname}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="mail-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Business Email"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    {!validateEmail(email) && email !== '' && (
                        <Text style={styles.errorText}>Please enter a valid email</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Icon name="lock-closed-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    {!validatePassword(password) && password !== '' && (
                        <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Icon name="business-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Business Name"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={businessName}
                            onChangeText={setBusinessName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="call-outline" size={20} color="#FFF" style={styles.icon} />
                        <TextInput
                            placeholder="Business Phone Number"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={contactPhoneNumber}
                            onChangeText={setContactPhoneNumber}
                        />
                    </View>
                </>
            )}

            {/* Buttons */}
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryColor }]} onPress={handleSignup}>
                <Text style={[styles.buttonText, { color: theme.textColor }]}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.alreadyHaveAccount}>
                Already have an account? 
                    <Text 
                    style={[{color: theme.primaryColor}]}
                    onPress={() => navigation.navigate('Login')}
                    >
                        Log-in
                    </Text>
            </Text>
        </View>
    );
}

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        marginTop:-50
    },
    subtitle: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        color: '#FFF',
        flex: 1,
    },
    segmentedControl: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    segmentedButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderRadius: 5,
      },
    button: {
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    alreadyHaveAccount: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: 5
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 10,
    },
})