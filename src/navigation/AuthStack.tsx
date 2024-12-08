import React, { useEffect } from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import OTPLogin from '../Screens/Mobile_verification/OTPLogin'
import OTPVerify from '../Screens/Mobile_verification/OTPVerify'

import LoginScreen from '../Screens/LoginScreen/LoginScreen'


const Stack = createStackNavigator()

export default function AuthStack() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
            <Stack.Screen name="OTPLogin" component={OTPLogin} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
            <Stack.Screen name="OTPVerify" component={OTPVerify} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
        </Stack.Navigator>
    )
}