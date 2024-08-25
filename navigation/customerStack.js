import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CustomerLandingScreen, SettingsScreen, QRCodeScannerScreen, AllTicketsScreen } from "../components/screens/screens.js";
import { TouchableOpacity, Image, StatusBar } from "react-native";
import { Icon } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext.js";

const Stack = createStackNavigator();

const CustomerStack = () => {
    // Get the theme and navigation objects from the ThemeContext and React Navigation
    // Navigation is declared explicitly here to allow for navigation to the Settings screen from the CustomerLanding screen header
    const { theme } = useTheme();
    const navigation = useNavigation();
    return (
        <>
            <StatusBar barStyle="light-content" />
            <Stack.Navigator>
                {/* CustomerLanding screen is the main screen for the customer */}
                {/* Logo is displayed instead of a title */}
                <Stack.Screen 
                    name="CustomerLanding" 
                    component={CustomerLandingScreen}
                    options={{
                        headerShown: true,
                        headerTitle: () => (
                            <Image
                                source={require('../assets/MYPARKERLOGO.png')}
                                style={{ width: 150, height: 50 }} // Adjust width and height as needed
                                resizeMode="contain"
                            />
                        ),
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                                <Icon name="menu" size={30} color={theme.primaryColor} style={{ marginLeft: 15 }} />
                            </TouchableOpacity>
                        ),
                        headerStyle: { backgroundColor: '#000' },
                        headerTintColor: '#fff',
                        headerTitleAlign: 'center',
                    }}
                />
                <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen}
                    options={{ headerShown: true, title: 'Settings', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center'}}
                />
                <Stack.Screen 
                    name="QRCodeScanner"
                    component={QRCodeScannerScreen}
                    options={{ headerShown: true, title: 'Scan QR Code', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center' }}
                />
                <Stack.Screen
                    name="AllTicketsScreen"
                    component={AllTicketsScreen}
                    options={{ headerShown: true, title: 'Your Parking Ticket History', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center'}}
                />
            </Stack.Navigator>
        </>
    );
}

export default CustomerStack;