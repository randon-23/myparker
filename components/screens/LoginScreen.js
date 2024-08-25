import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthService } from '../../services/AuthService';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  // These are the states for the email and password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //This is a user type that will determine the state of the login screen
  const [userType, setUserType] = useState('customer'); //Local usertype mainly for setting of theme

  const { theme, updateTheme } = useTheme(); // Get the theme and updateTheme function from the ThemeContext
  const { login } = useAuthService(); // Get the login function from the AuthService

  // Function to handle the login process
  const handleLogin = async () => {
    // Check if the email and password fields are empty
    if(!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create a formData object with the email, password, and userType
    const formData = {
      userType,
      email,
      password
    }

    // Call the login function from the AuthService with the formData object
    try{
      // Call the login function from the AuthService with the formData object and store the response
      const response = await login(formData.email, formData.password, formData.userType);

      // If the response is successful, log the session data
      if(!response.success){

        // If the error message is related to the user type or email/password, show an alert with the error message
        if(response.error.includes('Account is not of selected type')){
          Alert.alert('Login error', response.error)
        } else if(response.error.includes('Invalid email or password')) { // If the usertype selected is correct but the credentials are wrong
          Alert.alert('Login error', response.error)
        } else {
          Alert.alert('Login error', `An error occurred - ${error.message}`) // If the error is not related to the user type or email/password
        }
      } else {
        console.log('Login successful')
        console.log(response.session)
      }

    } catch(error){
      Alert.alert('Login error', error.message)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor}]}>
      {/* Logo */}
      <Image source={userType === 'customer' ? require('../../assets/MYPARKERLOGO.png') : require('../../assets/MYPARKERLOGOBUSINESS.png')} style={styles.logo} resizeMode='contain' />

      {/* Login Form */}
      <Text style={styles.title}>Login to your account</Text>
      <View style={[styles.inputContainer, {marginTop: 20}]}>
        <Icon name="mail-outline" size={20} color="#FFF" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
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

      {/* Buttons */}
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            onPress={() => {
              setUserType('customer');
              updateTheme('customer');
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

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primaryColor }]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: theme.textColor }]}>Log-in</Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline, { borderColor: theme.primaryColor }]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.buttonText, { color: theme.primaryColor }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8,
    height: height * 0.3,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
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
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  }
});
