import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, { ZegoSendCallInvitationButton, ONE_ON_ONE_AUDIO_CALL_CONFIG, ZegoMenuBarButtonName } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { useCurrentUser } from '../context/UserContext'
import firestore from '@react-native-firebase/firestore'
import { Colors } from '../Styles'
import { AuthContext } from '../context/AuthProvider'
import UUIDGenerator from 'react-native-uuid';

export default function WaitingDetails({ selectedUserId, selectedUsername, onRemove, showBottomSheet }) {

    const currentUser = useCurrentUser();
    const navigation = useNavigation();
    const { user } = useContext(AuthContext)

    // const initServices = () => {
    //     ZegoUIKitPrebuiltCallService.init(
    //         869286775,
    //         '27736466eb05c969614ac30d11bb925defab9d0b12771891ff0ab9cef0fec3be',
    //         user.uid,
    //         user.uid+"abc",
    //         [ZIM, ZPNs],
    //         {
    //             ringtoneConfig: {
    //                 incomingCallFileName: 'zego_incoming.mp3',
    //                 incomingCallFileName: 'zego_incoming.mp3',
    //                 outgoingCallFileName: 'zego_outgoing.mp3',
    //             },
    //             androidNotificationConfig: {
    //                 channelID: "zego_call",
    //                 channelName: "zego_call",
    //             },
    //         }
    //     );
    // }

    const handleCall = (selectedUserId, selectedUserName) => {
        const currentUserUid = user.uid;
        const selectedUserRef = firestore().collection('user_Data').doc(selectedUserId);
        const currentUserRef = firestore().collection('user_Data').doc(currentUserUid);

        // Promise to handle creating messageList for selected user
        const createMessageListForSelectedUser = selectedUserRef.collection('messageList').doc(currentUserUid).set({
            userId: currentUserUid,
            username: currentUser?.username,
        });

        // Promise to handle creating messageList for current user
        const createMessageListForCurrentUser = currentUserRef.collection('messageList').doc(selectedUserId).set({
            userId: selectedUserId,
            username: selectedUserName,
        });

        // Execute both promises in parallel
        Promise.all([createMessageListForSelectedUser, createMessageListForCurrentUser])
            .then(() => {
                console.log('MessageLists created successfully for both users.');
                const messageId = UUIDGenerator.v4();
                // Add a message to the chats collection for the selected user
                firestore().collection("chats")
                    .doc(selectedUserId + currentUserUid)
                    .collection("messages")
                    .add({
                        _id: messageId,
                        text: "Voice call completed",
                        messageTime: new Date(),
                        createdAt: Date.parse(new Date()),
                        user: {
                            _id: currentUserUid,
                        }
                    })
                    .then(() => {
                        console.log("Voice call completed message added to selected user's chats collection.");
                    })
                    .catch((error) => {
                        console.error("Error adding voice call completed message to selected user's chats collection: ", error);
                    });

                // Add a message to the chats collection for the current user
                firestore().collection("chats")
                    .doc(currentUserUid + selectedUserId)
                    .collection("messages")
                    .add({
                        _id: messageId,
                        text: "Voice call completed",
                        messageTime: new Date(),
                        createdAt: Date.parse(new Date()),
                        user: {
                            _id: currentUserUid,
                        }
                    })
                    .then(() => {
                        console.log("Voice call completed message added to current user's chats collection.");
                    })
                    .catch((error) => {
                        console.error("Error adding voice call completed message to current user's chats collection: ", error);
                    });
            })
            .catch((error) => {
                console.error('Error handling call:', error);
            });
    }


    return (

        <View style={styles.overlay}>
            <View style={styles.selectedContainer}>
                <View style={{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Image style={{ height: 160, width: 160, borderRadius: 80, marginBottom: 10 }} source={require('../assets/avatar.jpg')} />
                    <Text style={{ color: Colors.light, fontSize: 22 }}>{selectedUsername}</Text>
                    <Text style={{ color: Colors.waitingCallsDetails, fontSize: 16, marginBottom: 15 }}>available</Text>
                    <Text style={{ color: Colors.waitingCallsDetails, fontSize: 16, marginBottom: 15 }}>30 calls in last 30 days | average call : 10 min</Text>
                    <View style={styles.userOptions}>
                        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                            <TouchableOpacity style={styles.optionButtons} onPress={onRemove}>
                                <AntDesign name='close' size={20} color={Colors.light} />
                            </TouchableOpacity>
                            <Text style={{ color: Colors.light, fontSize: 14 }}>remove</Text>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                            <TouchableOpacity style={styles.optionButtons}>
                                <Feather name='square' size={20} color={Colors.light} />
                            </TouchableOpacity>
                            <Text style={{ color: Colors.light, fontSize: 14 }}>visit profile</Text>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                            <TouchableOpacity style={styles.optionButtons}>
                                <ZegoSendCallInvitationButton
                                    //icon={require('../assets/callLight.png')}
                                    backgroundColor={Colors.gray}
                                    invitees={[{ userID: selectedUserId, userName: selectedUsername }]}
                                    isVideoCall={false}
                                    resourceID={'zego_data'}
                                    iconStyle={{
                                        width: 24, // Change the width to your desired size
                                        height: 24, // Change the height to your desired size
                                    }}
                                    onPressed={() => handleCall(selectedUserId, selectedUsername)}
                                />
                            </TouchableOpacity>
                            <Text style={{ color: Colors.light, fontSize: 14 }}>call now</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)', // semi-transparent background
        zIndex: 999,
    },
    selectedContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        marginTop: 150,
        position: 'absolute',
        zIndex: 999,
    },
    userOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        marginTop: 20
    },
    optionButtons: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})