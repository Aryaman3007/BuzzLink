import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import FirstScreen from '../Screens/SplashScreen/FirstScreen';
import PasswordScreen from '../Screens/DetailScreen/PasswordScreen';
import ProfileDetailsScreen from '../Screens/DetailScreen/ProfileDetailScreen';
import LastDetail from '../Screens/DetailScreen/LastDetail';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const PostRegisterDetailsStack = ({ initialRouteName, toggleDetailsScreen}) => {
  const navigation = useNavigation()


  return (
    <Stack.Navigator initialRouteName={initialRouteName ? initialRouteName : "PasswordScreen"}>
      <Stack.Screen name="PasswordScreen" component={PasswordScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
      <Stack.Screen name="ProfileDetailScreen" component={ProfileDetailsScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
      <Stack.Screen name="LastDetail" initialParams={{"toggleDetailsScreen": toggleDetailsScreen}} component={LastDetail} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
    </Stack.Navigator>
  );
};

export default PostRegisterDetailsStack;
