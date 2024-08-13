import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BusinessLandingScreen } from "../screens/screens.js";

const Stack = createStackNavigator();

const BusinessStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BusinessLanding" component={BusinessLandingScreen} />
        </Stack.Navigator>
    );
}

export default BusinessStack;