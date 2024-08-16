import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../components/screens/screens.js';
import { SignupScreen } from '../components/screens/screens.js';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true, title: 'Sign Up', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />
        </Stack.Navigator>
    );
}

export default AuthStack;