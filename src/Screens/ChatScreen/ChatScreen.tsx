import { StyleSheet, Text, View, Image, TextInput, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Bubble, GiftedChat, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ZegoUIKitPrebuiltCallService, { ZegoSendCallInvitationButton, ONE_ON_ONE_AUDIO_CALL_CONFIG, ZegoMenuBarButtonName } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import { AuthContext } from '../../context/AuthProvider'
import { useCurrentUser } from '../../context/UserContext'
import { Colors } from '../../Styles'
import { ThemeContext } from '../../context/ThemeContext'

export default function ChatScreen({ route }) {

  const [messageList, setMessageList] = useState([])
  const navigation = useNavigation()
  const [contacts, setContacts] = useState([])
  const { targetUserId, targetUsername } = route.params;
  const { user } = useContext(AuthContext)
  const currentUser = useCurrentUser()
  const { isDarkMode } = useContext(ThemeContext);

  const lightTheme = {
    backgroundColor: Colors.light,
    textColor: Colors.profileBlack,
    iconColor: Colors.profileBtn1,
    leftChat: '#e6e6e6',
    rightChat: '#0073e6'
  };

  const darkTheme = {
    backgroundColor: Colors.profileBlack,
    textColor: Colors.light,
    iconColor: '#666',
    leftChat: Colors.chatLeftColor,
    rightChat: Colors.light
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const fetchUserData = async () => {
    let tempData = []
    const snapshot = await firestore().collection('users').where('email', '!=', currentUser?.email).get().then(res => {
      if (res.docs != []) {
        res.docs.map(item => {
          tempData.push(item.data())
        })
      }
      setContacts(tempData)
    })
  }

  // const initServices = () => {
  //   ZegoUIKitPrebuiltCallService.init(
  //     869286775,
  //     '27736466eb05c969614ac30d11bb925defab9d0b12771891ff0ab9cef0fec3be',
  //     user.uid,
  //     currentUser?.username,
  //     [ZIM, ZPNs],
  //     {
  //       ringtoneConfig: {
  //         incomingCallFileName: 'zego_incoming.mp3',
  //         outgoingCallFileName: 'zego_outgoing.mp3',
  //       },
  //       androidNotificationConfig: {
  //         channelID: "zego_call",
  //         channelName: "zego_call",
  //       },
  //     }
  //   );
  // }

  // const initServices = () => {
  //   ZegoUIKitPrebuiltCallService.init(
  //     869286775,
  //     '27736466eb05c969614ac30d11bb925defab9d0b12771891ff0ab9cef0fec3be',
  //     currentUser?.userId,
  //     currentUser?.username,
  //     [ZIM, ZPNs],
  //     {
  //       innerText: {
  //         incomingVoiceCallDialogTitle: "%0",
  //         incomingVoiceCallDialogMessage: "Incoming voice call...",
  //       },
  //       onIncomingCallDeclineButtonPressed: () => {
  //         console.log('**************************Call hangup')
  //       },
  //       androidNotificationConfig: {
  //         channelID: "zego_call",
  //         channelName: "zego_call",
  //       },
  //       ringtoneConfig: {
  //         incomingCallFileName: 'zego_incoming.mp3',
  //         outgoingCallFileName: 'zego_outgoing.mp3',
  //       },
  //       showMicrophoneStateOnView: false,
  //       showCameraStateOnView: false,
  //       showUserNameOnView: false,
  //       notifyWhenAppRunningInBackgroundOrQuit: true,
  //       requireConfig: (data) => {
  //         return {
  //           ...ONE_ON_ONE_AUDIO_CALL_CONFIG,
  //           hangUpConfirmInfo: {
  //             title: "Hangup confirm",
  //             message: "Do you want to hangup?",
  //             cancelButtonName: "Cancel",
  //             confirmButtonName: "Confirm"
  //           },
  //           turnOnCameraWhenJoining: false,
  //           turnOnMicrophoneWhenJoining: true,
  //           useSpeakerWhenJoining: true,
  //           bottomMenuBarConfig: {
  //             maxCount: 3,
  //             buttons: [
  //               ZegoMenuBarButtonName.toggleMicrophoneButton,
  //               ZegoMenuBarButtonName.hangUpButton,
  //               ZegoMenuBarButtonName.switchAudioOutputButton,
  //             ],
  //           },
  //           // timingConfig: {
  //           //   isDurationVisible: true,
  //           //   onDurationUpdate: (duration) => {
  //           //     console.log('########CallWithInvitation onDurationUpdate', duration);
  //           //     if (duration === 10 * 60) {
  //           //       ZegoUIKitPrebuiltCallService.hangUp();
  //           //     }
  //           //   }
  //           // },
  //           // onHangUp: (duration) => {
  //           //   console.log(duration)
  //           //   ZegoUIKitPrebuiltCallService.hangUp();              
  //           // },
  //           avatarBuilder: () => {
  //             return (<View style={{ width: '100%', height: '100%' }}>
  //               <Image
  //                 style={{ width: '100%', height: '100%' }}
  //                 resizeMode="cover"
  //                 source={require('../../assets/avatar.jpg')}
  //               />
  //             </View>
  //             )
  //           },
  //         }
  //       }
  //     }
  //   )
  // }

  useEffect(() => {
    // console.log('Target user ID:', route.params.data?.userId);
    // console.log('Current user ID:', currentUser?.userId);
    const fetchCpmValue = async () => {
      try {
        const influencerDoc = await firestore().collection('influencers').doc(targetUserId).get();
        if (influencerDoc.exists) {
          const cpmValue = influencerDoc.data().cpm;
          console.log('CPM value:', cpmValue);
          setCpmValue(cpmValue);
        } else {
          console.log('Influencer document not found for user ID:', targetUserId);
        }
      } catch (error) {
        console.error('Error fetching CPM value:', error);
      }
    };
    const fetchCoinValue = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(currentUser?.userId).get();
        if (userDoc.exists) {
          const coinValue = userDoc.data().coin;
          console.log('Coin value:', coinValue);
          setCoinValue(coinValue);
        } else {
          console.log('User document not found for user ID:', currentUser?.userId);
        }
      } catch (error) {
        console.error('Error fetching coin value:', error);
      }
    };
    fetchCoinValue();
    fetchCpmValue();
  }, [currentUser, route.params.data])

  const [cpmValue, setCpmValue] = useState(0);
  const [coinValue, setCoinValue] = useState(0);

  const handleCallPress = () => {
    if (coinValue >= cpmValue) {
      ZegoUIKitPrebuiltCallService.inviteUser({
        isVideoCall: false,
        invitees: [{ userID: targetUserId, userName: targetUsername }],
        resourceID: 'zego_data',
        invitationExtraInfo: '',
        onSuccess: () => {
          console.log('Call placed successfully');
        },
        onFail: (errorCode, errorMessage) => {
          console.error('Failed to place call:', errorMessage);
        }
      });
    } else {
      Alert.alert(
        'Low Balance',
        'Your coin balance is insufficient for this call. Please recharge your account.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };

  useEffect(() => {
    const querySnapshot = firestore()
      .collection("chats")
      .doc(currentUser?.userId + targetUserId)
      .collection("messages")
      .orderBy("createdAt", "desc");
    const unsubscribe = querySnapshot.onSnapshot(querysnapshot => {
      const allMessages = querysnapshot.docs.map(item => {
        return { ...item._data, createdAt: item._data.createdAt };
      });
      setMessageList(allMessages);
    });

    return () => unsubscribe();
  }, [currentUser])

  useEffect(() => {
    // initServices();
    fetchUserData();
  }, [currentUser])

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0]
    console.log(msg)
    const myMsg = {
      ...msg,
      senderId: currentUser?.userId,
      receiverId: targetUserId,
      createdAt: Date.parse(msg.createdAt),
      messageTime: new Date()
    }
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    )
    firestore().collection('chats')
      .doc(currentUser?.userId + targetUserId)
      .collection('messages')
      .add(myMsg);
    firestore().collection('chats')
      .doc(targetUserId + currentUser?.userId)
      .collection('messages')
      .add(myMsg);

    // firestore().collection('chats')
    //   .doc("" + targetUserId + currentUser?.userId)
    //   .collection('messages')
    //   .add(myMsg)
  }, [])

  const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme.leftChat,
          borderTopColor: Colors.profileBorderColor,
          color: theme.textColor,
        }}
        renderComposer={props => (
          <Composer
            {...props}
            placeholder="Type your message here..."
            textInputStyle={{ color: theme.textColor, fontSize: 15 }}
          />
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: theme.leftChat }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AntDesign name='arrowleft' color={theme.textColor} size={20} onPress={() => navigation.goBack()} />
          <TouchableOpacity style={{ marginLeft: 25, marginRight: 10 }}>
            <Image
              style={{ height: 30, width: 30, borderRadius: 15 }}
              source={require('../../assets/avatar.jpg')}
            />
          </TouchableOpacity>
          <Text style={[styles.headerUsername, { color: theme.textColor }]}>{targetUsername}</Text>
        </View>
      </View>
      <View style={{ flex:1 }}>
        <GiftedChat
          placeholder='Send a message...'
          messages={messageList}
          onSend={messages => onSend(messages)}
          user={{
            _id: currentUser?.userId,
          }}
          alwaysShowSend
          renderSend={props => {
            return (
              <Send {...props}>
                <View style={{ marginBottom: 10, marginRight: 10 }}>
                  <Ionicons style={styles.sendIcon} name='send' color={theme.textColor} size={25} />
                </View>
              </Send>
            )
          }}
          scrollToBottom
          scrollToBottomComponent={() => {
            return (
              <FontAwesome name='angle-double-down' size={22} color={theme.textColor} style={{ backgroundColor: theme.leftChat, borderRadius: 35, padding: 10 }} />
            )
          }}
          renderInputToolbar={props => customtInputToolbar(props)}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{ right: { color: theme.backgroundColor }, left: { color: theme.textColor } }}
                timeTextStyle={{ right: { color: theme.backgroundColor }, left: { color: theme.textColor } }}
                wrapperStyle={{
                  left: {
                    //backgroundColor: '#dedddc'
                    backgroundColor: theme.leftChat
                  },
                  right: {
                    //backgroundColor: '#682cec'
                    backgroundColor: theme.rightChat
                  }
                }}
              />
            )
          }}
          renderAvatar={() => (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={require('../../assets/avatar.jpg')}
              />
            </View>
          )}
          /* showUserAvatar ={() => (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={require('../../assets/avatar.jpg')}
              />
            </View>
          )} */
          showUserAvatar={true}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.profileBlack
  },
  header: {
    backgroundColor: Colors.chatLeftColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  headerUsername: {
    color: Colors.light,
    fontSize: 20,
  },
  inputText: {
    color: Colors.light,
    fontSize: 60
  },
  avatarContainer: {

  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  }
})