import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Notifications } from 'react-native-notifications';
import { Picker } from '@react-native-picker/picker'
import auth from '@react-native-firebase/auth';
import { FirebaseLink } from '../enum/FirebaseLink';

const NotificationSender: React.FC = () => {
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [notificationContent, setNotificationContent] = useState<string>('');
  const [notificationType, setNotificationType] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message received in foreground:', remoteMessage);

      Notifications.postLocalNotification({
        title: remoteMessage.data.title || 'Notification',
        body: remoteMessage.data.body || '',
        sound: 'default',
        silent: false,
        userInfo: {},
      });
    });

    const getFCMToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        console.log('FCM Registration Token:', fcmToken);
        return fcmToken;
      } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
      }
    };

    getFCMToken();

    const user = auth().currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const sendNotification = async () => {
    try {
      const currentToken = await messaging().getToken();

      const serverKey = 'AAAAVPCzfwM:APA91bGcu_xg7Hjp3H1xAuDhtcAfYFRIcffj2oCnnmEf3M7SREC92Q7lDH0ctbzIofS9_kdHJrX3IFBMtNBlastXgPW3zIK_CP8adaHVkPOajo7TcvfCh5k_rRrr97iDE-ne6o10cnmw';
      console.log('Current Token:', currentToken);

      const targetUserSnapshot = await firestore()
        .collection('users')
        .where('userId', '==', targetUserId)
        .get();

      if (targetUserSnapshot.empty) {
        console.error('Target user not found in Firestore');
        return;
      }

      const targetUserToken = targetUserSnapshot.docs[0].data().fcmToken;

      const notificationPayload = {
        to: currentToken,
        data: {
          title: 'New Notification',
          body: notificationContent,
          targetUserId: targetUserId,
          notificationType: notificationType,
        },
      };

      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${serverKey}`,
        },
        body: JSON.stringify(notificationPayload),
      });

      const responseData = await response.json();
      console.log('FCM Response:', responseData);

      await FirebaseLink(
        targetUserId,
        notificationContent,
        notificationType,
        currentUserId
      );

      setTargetUserId('');
      setNotificationContent('');
      setNotificationType('');
    } catch (error) {
      console.error('Error sending notification:', error);
      console.error('Error getting token:', error);
    }
  };

  return (
    <View>

    </View>
  );
};

export default NotificationSender;
