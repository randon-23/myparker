import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CustomerLandingScreen, SettingsScreen } from "../screens/screens.js";
import { TouchableOpacity, Image, StatusBar } from "react-native";
import { Icon } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const CustomerStack = ({ navigation }) => {
    
    return (
        <>
            <StatusBar barStyle="light-content" />
            <Stack.Navigator>
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
                                <Icon name="menu" size={30} color="#FFD700" style={{ marginLeft: 15 }} />
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
            </Stack.Navigator>
        </>
    );
}

export default CustomerStack;