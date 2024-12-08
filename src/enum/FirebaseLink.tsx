
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const FirebaseLink = async (
  targetUserId: string,
  notificationContent: string,
  notificationType: string,
  currentUserId: string,
  tweetId: string,
  fcmToken: string,
) => {
  try {
    const targetUserSnapshot = await firestore()
      .collection('users')
      .where('userId', '==', targetUserId)
      .get();

    if (targetUserSnapshot.empty) {
      console.error('Target user not found in Firestore');
      return;
    }

    await firestore().collection('notifications').add({
      targetUserId: targetUserId,
      notificationContent: notificationContent,
      createdAt: new Date(),
      actorId: currentUserId,
      notificationType: notificationType,
      isReceived: false,
      isRead: false,
      tweetId: tweetId,
    });

    console.log('Notification stored in Firestore');
  } catch (error) {
    console.error('Error storing notification in Firestore:', error);
  }
};

export { FirebaseLink };
