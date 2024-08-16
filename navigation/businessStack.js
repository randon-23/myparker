import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BusinessLandingScreen } from "../components/screens/screens.js";
import { SettingsScreen } from "../components/screens/screens.js";
import { useTheme } from "../contexts/ThemeContext.js";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const BusinessStack = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <Stack.Navigator>
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
        </Stack.Navigator>
    );
}

export default BusinessStack;