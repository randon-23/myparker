import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BusinessLandingScreen, SettingsScreen, BusinessQRCodeScreen, QRCodeScannerScreen, AllTicketsScreen } from "../components/screens/screens.js";
import { TouchableOpacity, Image, StatusBar } from "react-native";
import { Icon } from 'react-native-elements';
import { useTheme } from "../contexts/ThemeContext.js";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const BusinessStack = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <>
            <StatusBar barStyle="light-content" />
            <Stack.Navigator>
                {/* BusinessLanding screen is the main screen for the customer */}
                {/* Logo is displayed instead of a title */}
                <Stack.Screen 
                    name="BusinessLanding" 
                    component={BusinessLandingScreen}
                    options={{
                        headerShown: true,
                        headerTitle: () => (
                            <Image
                                source={require('../assets/MYPARKERLOGOBUSINESS.png')}
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
                {/* QR Code Screen which either dispalys Generate QR Code button or Business QR Code with ability to Share or Download */}
                <Stack.Screen
                    name="BusinessQRCode"
                    component={BusinessQRCodeScreen}
                    options={{ headerShown: true, title: 'Your Business QR Code', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center'}}
                />
                <Stack.Screen
                    name="QRCodeScanner"
                    component={QRCodeScannerScreen}
                    options={{ headerShown: true, title: 'Scan Customer QR Code', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center'}}
                />
                <Stack.Screen
                    name="AllTicketsScreen"
                    component={AllTicketsScreen}
                    options={{ headerShown: true, title: 'Current Active Parkings', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleAlign: 'center'}}
                />
            </Stack.Navigator>
        </>
        
    );
}

export default BusinessStack;