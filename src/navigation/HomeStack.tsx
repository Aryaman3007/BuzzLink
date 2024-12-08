import React from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import YourTopics from '../Screens/WaitingCalls/YourTopics';
import InterestedUsersScreen from '../Screens/WaitingCalls/InterestedUsersScreen';
import BuyCoin from '../Screens/CoinScreen/BuyCoin';
import MyBalance from '../Screens/HomeScreen/MyBalance';
import BalanceHistoryCard from '../Screens/HomeScreen/BalanceHistoryCard';
import ConnectScreen from '../Screens/ConnectScreen/ConnectScreen';
import MatchingScreen from '../Screens/ConnectScreen/MatchingScreen';
import SampleScreen from '../components/SampleScreen';
import TopicsScreen from '../Screens/WaitingCalls/TopicsScreen';
import TweetCard from '../Screens/TweetScreen/TweetCard';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="YourTopics"
        component={YourTopics}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InterestedUsersScreen"
        component={InterestedUsersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuyCoin"
        component={BuyCoin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BalanceHistoryCard"
        component={BalanceHistoryCard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyBalance"
        component={MyBalance}
        options={{ headerShown: false }}
        />
       <Stack.Screen
        name="ConnectScreen"
        component={ConnectScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="MatchingScreen"
        component={MatchingScreen}
        options={{ headerShown: true, tabBarVisible: false }}
      />
      <Stack.Screen
        name="TopicsScreen"
        component={TopicsScreen}
        options={{ headerShown: true, tabBarVisible: false }}
      />
      <Stack.Screen
        name="TweetCard"
        component={TweetCard}
        options={{ headerShown: false ,cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
