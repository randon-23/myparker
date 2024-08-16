import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthService } from '../auth/AuthService';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //This is a user type that will determine the state of the login screen
  const [userType, setUserType] = useState('customer');
  const [theme, setTheme] = useState({
    primaryColor: '#FFD700',
    textColor: '#000',
    backgroundColor: '#000',
  });
  const { login } = useAuthService();

  const updateTheme = (type) => {
    if (type === 'business') {
      setTheme({
        primaryColor: '#40E0D0',
        textColor: '#000',
        backgroundColor: '#000',
      });
    } else {
      setTheme({
        primaryColor: '#FFD700',
        textColor: '#000',
        backgroundColor: '#000',
      });
    }
  };

  const handleLogin = async () => {
    if(!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formData = {
      userType,
      email,
      password
    }

    try{
      const response = await login(formData.email, formData.password, formData.userType);

      if(!response.success){
        console.log(response)
        
        if(response.error.includes('Account is not of selected type.')){
          Alert.alert('Login error', response.error)
        } else if(response.error.includes('Invalid email or password')) {
          Alert.alert('Login error', response.error)
        } else {
          Alert.alert('Login error', `An error occurred - ${error.message}`)
        }
      } else {
        console.log('Login successful')
        console.log(response.session)
      }

    } catch(error){
      console.error('Login error:', error.message);
      Alert.alert('Login error', error.message)
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={userType === 'customer' ? require('../assets/MYPARKERLOGO.png') : require('../assets/MYPARKERLOGOBUSINESS.png')} style={styles.logo} resizeMode='contain' />

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
          <Text style={[styles.buttonText, styles.buttonOutlineText, { color: theme.primaryColor }]}>Sign Up</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // 30% of screen height,
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
  },
  buttonOutlineText: {
    color: '#FFD700',
  },
  forgotPassword: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
  },
});
