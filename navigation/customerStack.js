import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CustomerLandingScreen } from "../screens/screens.js";

const Stack = createStackNavigator();

const CustomerStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CustomerLanding" component={CustomerLandingScreen} />
        </Stack.Navigator>
    );
}

export default CustomerStack;