import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Colors } from '../Styles';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../context/AuthProvider';

export default function MessageCard({ userId, color, otherUser, openChat }) {

  const [lastMessage, setLastMessage] = useState("")
  const [messageSender, setMessageSender] = useState("")
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)

  const getAllMessages = async () => {
    try {
      const chatId = userId + otherUser.userId; // Assuming a unique ID for the chat based on user IDs
      const chatDoc = firestore().collection('chats').doc(chatId).collection('messages').orderBy('messageTime', 'desc').onSnapshot(querySnapshot => {
        const lastMessages = [];
        querySnapshot.forEach(documentSnapshot => {
          lastMessages.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id
          });
        });

        lastMessages.sort((a, b) => b.messageTime - a.messageTime);

        const latestMessage = lastMessages.length > 0 ? lastMessages[0].text : "Start a talk!";
        const messageSenderId = lastMessages.length > 0 ? lastMessages[0].senderId : "Start a talk!";
        if (messageSenderId == userId) {
          setMessageSender("You")
        } else {
          setMessageSender(otherUser.username)
        }
        setLastMessage(latestMessage)
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  const blockUser = async () => {
    try {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to block ${otherUser.username}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Block',
            onPress: async () => {
              await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  blockedUsers: firestore.FieldValue.arrayUnion({
                    userId: otherUser.userId,
                    userName: otherUser.username,
                  })
                });

              console.log('User blocked successfully');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };


  useEffect(() => {
    getAllMessages();
  }, [])


  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Image style={styles.cardImg} source={require('../assets/avatar.jpg')} />
      </View>
      <TouchableOpacity style={styles.cardMiddle} onPress={openChat}>
        <Text style={{ color: color, fontSize: 18 }}>{otherUser.username}</Text>
        <Text style={{ color: Colors.grey, fontSize: 15 }} numberOfLines={1}>{messageSender}: {lastMessage}</Text>
      </TouchableOpacity>
      <View style={styles.cardRight}>
        <Entypo name='dots-three-vertical' size={20} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center'
  },
  cardMiddle: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: 5,
    paddingVertical: 2
  },
  cardRight: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cardImg: {
    height: 56,
    width: 56,
    borderRadius: 28
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
