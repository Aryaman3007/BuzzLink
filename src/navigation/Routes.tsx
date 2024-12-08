import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../context/AuthProvider';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { createStackNavigator } from '@react-navigation/stack';

import firestore from '@react-native-firebase/firestore';
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import HomeStack from './HomeStack';
import PostRegisterDetailsStack from './PostRegisterDetailsStack';
import BottomNav from '../components/BottomNav';
import { UserProvider } from '../context/UserContext';
import PushNotification from 'react-native-push-notification';
import { SelectedUserProvider } from '../context/SelectedUserProvider';

const Stack = createStackNavigator();
const Routes = ({ }) => {
  const { user, setUser } = useContext(AuthContext);
  const [initialize, setInitialize] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailsScreen, setShowDetailsScreen] = useState(false);
  const [detailsRouteName, setDetailsRouteName] = useState<string>('PasswordScreen');
  const navigation = useNavigation();

  const onAuthStateChanged = async (user: any) => {
    setUser(user);
    checkIfDetailsCompleted();
    if (initialize) setInitialize(false);
  };

  const toggleDetailsScreenVisibility = () => {
    setShowDetailsScreen(!showDetailsScreen);
  }

  const checkIfDetailsCompleted = async () => {
    setIsLoading(true);

    const currentUser = auth().currentUser;
    if (currentUser) {
      const uid = currentUser.uid;
      const userDoc = await firestore().collection('users').doc(uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const postRegisterStep = userData?.postRegisterStep;
        switch (postRegisterStep) {
          case "HomeScreen":
            setShowDetailsScreen(false);
            break;
          case "PasswordScreen":
            setShowDetailsScreen(true);
            setDetailsRouteName("PasswordScreen");
            break;
          case "ProfileDetailScreen":
            setShowDetailsScreen(true);
            setDetailsRouteName("ProfileDetailScreen");
            break;
          case "LastDetail":
            setShowDetailsScreen(true);
            setDetailsRouteName("LastDetail");
            break;
          default:
            setShowDetailsScreen(false);
        }
      } else {
        setShowDetailsScreen(false);
      }
    } else {
      setShowDetailsScreen(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('notifications')
        .where('targetUserId', '==', 'actorId')
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const notificationData = doc.data();
            PushNotification.localNotification({
              channelId: 'channel-id',
              title: notificationData.title,
              message: notificationData.body,
            });
          });
        });

      return unsubscribe;
    }
  }, [user]);

  if (initialize) return null;
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  return user ? (
    showDetailsScreen ? (
      <PostRegisterDetailsStack initialRouteName={detailsRouteName} toggleDetailsScreen={toggleDetailsScreenVisibility} />
    ) : (
      <UserProvider children={undefined}>
        <SelectedUserProvider>
          <BottomNav />
        </SelectedUserProvider>
      </UserProvider>
    )
  ) : (
    <AuthStack />
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Routes;