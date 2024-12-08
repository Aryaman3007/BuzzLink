import React, { useEffect } from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screens/HomeScreen/HomeScreen'
import FirstScreen from '../Screens/SplashScreen/FirstScreen'
import SecondScreen from '../Screens/SplashScreen/SecondScreen'
import ThirdScreen from '../Screens/SplashScreen/ThirdScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CONSTANTS } from '../constants/constants'
import { useFocusEffect } from '@react-navigation/native'

const SplashStack = createStackNavigator()

export default function Splashscreenstack({navigation}) {
  
  const checkSkipFlag = async () => {
    try {
      const skipped = await AsyncStorage.getItem(CONSTANTS.firstTimeOpen);
      if (skipped === 'false') {
        // Navigate to the desired screen in MainNavigator
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainNavigator' }],
        });
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // Add listener to detect when the screen comes into focus
    const focusListener = navigation.addListener('focus', () => {
      checkSkipFlag();
    });

    // Cleanup the listener when the component unmounts
    return () => {
      focusListener();
    };
  }, [navigation]);
  return (
    <SplashStack.Navigator initialRouteName="FirstScreen">
    <SplashStack.Screen name='FirstScreen' component={FirstScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
    <SplashStack.Screen
    name='SecondScreen'
    component={SecondScreen}
    options={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}
    />
    <SplashStack.Screen name='ThirdScreen' component={ThirdScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
    </SplashStack.Navigator>
  )
}