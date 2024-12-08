import { Image, StatusBar, StyleSheet, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { CONSTANTS } from './constants/constants';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import Routes from './navigation/Routes';
import { ThemeProvider } from './context/ThemeContext';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AuthProvider } from './context/AuthProvider';
import { UserProvider } from './context/UserContext';
import PushNotification from 'react-native-push-notification';
import { ZegoUIKitPrebuiltCallWaitingScreen, ZegoUIKitPrebuiltCallInCallScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn'

LogBox.ignoreAllLogs();

PushNotification.createChannel(
  {
    channelId: "channel-id",
    channelName: "My channel",
    channelDescription: "A channel to categorise your notifications",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`)
);

const data = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    // image: require('./assets/1.jpg'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    // image: require('./assets/3.jpg'),
    backgroundColor: '#22bcb5',
  },
];

const Stack = createStackNavigator();
type Item = (typeof data)[0];

const toastConfig = {
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'red' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
      }}
    />
  ),
};

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [navigationReady, setNavigationReady] = useState(false);
  const _renderItem = ({ item }: { item: Item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.backgroundColor,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        {/* <Image source={item.image} style={styles.image} /> */}
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const _keyExtractor = (item: Item) => item.title;

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text>Next</Text>
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text>Done</Text>

      </View>
    );
  };
  useEffect(() => {
    AsyncStorage.getItem(CONSTANTS.firstTimeOpen).then(value => {
      if (value === null) {
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
      }
    });
    setIsLoading(false);
  }, []);
  const _handleDone = () => {
    AsyncStorage.setItem(CONSTANTS.firstTimeOpen, 'false');
    setIsFirstTime(false);
  };
  if (isLoading) {
    return <Text>Loading</Text>;
  }
  return isFirstTime ? (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        keyExtractor={_keyExtractor}
        renderDoneButton={_renderDoneButton}
        renderNextButton={_renderNextButton}
        renderItem={_renderItem}
        data={data}
        onDone={_handleDone}
      />
    </View>
  ) : (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <ZegoCallInvitationDialog />
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent', // fallback for old browsers
    // background: 'linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b)', // for web
    // padding: 16,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});