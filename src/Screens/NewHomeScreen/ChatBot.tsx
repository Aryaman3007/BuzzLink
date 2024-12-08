import { StyleSheet, Text, View, Image, TextInput, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Button } from 'react-native'
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
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import UUIDGenerator from 'react-native-uuid';

export default function ChatBot({ route }) {

    const [messageList, setMessageList] = useState([])
    const navigation = useNavigation()
    const [contacts, setContacts] = useState([])
    const { targetUserId, targetUsername } = route.params;
    const { user } = useContext(AuthContext)
    const currentUser = useCurrentUser()
    const { isDarkMode } = useContext(ThemeContext);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [requestTitle, setRequestTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [eventType, setEventType] = useState('');
    const [eventTiming, setEventTiming] = useState('Select Date');
    const [contact, setContact] = useState('');
    const [wishType, setWishType] = useState('');
    const [wishMessage, setWishMessage] = useState('');
    const [customRequest, setCustomRequest] = useState('');
    const [customRequestInfo, setCustomRequestInfo] = useState('');
    const [messages, setMessages] = useState([])

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [items, setItems] = useState([
        { label: 'Birthday', value: 'Birthday' },
        { label: 'Wedding', value: 'Wedding' },
    ]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        const dt = new Date(date)
        const x = dt.toISOString().split('T');
        const x1 = x[0].split('-');
        setEventTiming(x1[2] + '/' + x1[1] + '/' + x1[0]);
        hideDatePicker();
    };

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
        const snapshot = await firestore().collection('users').where('email', '!=', currentUser.email).get().then(res => {
            if (res.docs != []) {
                res.docs.map(item => {
                    tempData.push(item.data())
                })
            }
            setContacts(tempData)
        })
    }

    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation]);


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
            const messageId = UUIDGenerator.v4();
            setMessages(allMessages)
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages,
                    {
                        _id: messageId,
                        text: 'This is a quick reply. What kind of message you want to send?',
                        createdAt: new Date(),
                        quickReplies: {
                            type: 'radio', // or 'checkbox',
                            keepIt: true,
                            values: [
                                {
                                    title: 'Invite for an event',
                                    value: 'yes',
                                },
                                {
                                    title: 'Video Wish',
                                    value: 'yes_picture',
                                },
                                {
                                    title: 'Custom Message',
                                    value: 'no',
                                },
                            ],
                        },
                        user: {
                            _id: targetUserId,
                            name: 'React Native',
                        },
                    },
                )
            )
        });

        return () => unsubscribe();
    }, [currentUser])

    useEffect(() => {
        // initServices();
        fetchUserData();
    }, [currentUser])

    const onSend = useCallback(async (messages = []) => {
        const msg = messages[0]
        const myMsg = {
            ...msg,
            senderId: currentUser?.userId,
            receiverId: targetUserId,
            createdAt: Date.parse(new Date()),
            messageTime: new Date()
        }
        setMessages(previousMessages =>
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
        //   .doc("" + targetUserId + currentUser.userId)
        //   .collection('messages')
        //   .add(myMsg)
    }, [])


    const toggleModal = () => {
        setShowModal(!showModal);
        console.log(showModal)
    };

    const resetStateVariables = () => {
        setRequestTitle('');
        setShowModal(false);
        setEventType('');
        setEventTiming('');
        setContact('');
        setWishType('');
        setWishMessage('');
        setCustomRequest('');
        setCustomRequestInfo('');
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
        setItems([
            { label: 'Birthday', value: 'Birthday' },
            { label: 'Wedding', value: 'Wedding' },
        ]);
    };

    const sendInvitation = async () => {
        if (currentUser?.coin >= 10) {
            const messageId = UUIDGenerator.v4();
            const invitationData = {
                requestType: requestTitle,
                senderId: currentUser?.userId,
                influencerId: targetUserId,
                eventType: eventType,
                eventTiming: eventTiming,
                contact: contact,
                wishType: wishType,
                wishMessage: wishMessage,
                customRequest: customRequest,
                customRequestInfo: customRequestInfo,
                coin: 10,
                createdAt: new Date(),
                date: new Date().getDate(),
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                isAccepted: false,
                isRejected: false
            };

            try {
                setShowModal(false);
                resetStateVariables();
                await firestore().collection('requests').add(invitationData);

                const updatedCoinValue = currentUser?.coin - 10;
                await firestore().collection('users').doc(user.uid).update({ coin: updatedCoinValue });

                const messageId = UUIDGenerator.v4();

                onSend([{
                    _id: messageId,
                    text: `Request is sent to ${targetUsername} for ${requestTitle}`,
                    messageTime: new Date(),
                    createdAt: Date.parse(new Date()),
                    user: {
                        _id: currentUser?.userId,
                    }
                }])
            } catch (error) {
                console.error('Error sending invitation:', error);
            }
        } else {
            Alert.alert(
                'Insufficient Coins',
                'Your coin balance is less than 100. Please recharge your account to send invitations.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
        }
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
            <GiftedChat
                placeholder='Send a message...'
                messages={messages}
                user={{
                    _id: currentUser?.userId,
                }}
                scrollToBottom
                scrollToBottomComponent={() => {
                    return (
                        <FontAwesome name='angle-double-down' size={22} color={theme.textColor} style={{ backgroundColor: theme.leftChat, borderRadius: 35, padding: 10 }} />
                    )
                }}
                disableComposer={true}
                onQuickReply={(reply) => {
                    setRequestTitle(reply[0].title)
                    toggleModal();
                }}
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
                            source={require('../../assets/bot.jpg')}
                        />
                    </View>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={toggleModal}
            >
                {requestTitle === "Invite for an event" && (
                    <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: theme.textColor, marginTop: 100, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontSize: 22 }}>Hurray!!!{'\n'}
                                <Text style={{ fontSize: 18, width: '80%' }}>Your celebrity is just 1 click away.
                                </Text>
                            </Text>
                            <TouchableOpacity onPress={toggleModal}>
                                <AntDesign name='closecircle' size={22} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column', marginTop: 25, paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 18 }}>Event Type</Text>
                                <DropDownPicker
                                    open={open1}
                                    value={eventType}
                                    items={items}
                                    setOpen={setOpen1}
                                    setValue={setEventType}
                                    setItems={setItems}
                                    containerStyle={{ width: '70%', marginTop: 10 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginTop: 20 }}>
                                <Text style={{ fontSize: 18 }}>Event Timings</Text>
                                <TouchableOpacity onPress={showDatePicker} style={{ paddingHorizontal: 10, paddingVertical: 10, borderWidth: 1, borderColor: theme.textColor, width: '70%', marginTop: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>{eventTiming}</Text>
                                    <AntDesign name='calendar' size={20} />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginTop: 20 }}>
                                <Text style={{ fontSize: 18 }}>Contact Info</Text>
                                <TextInput
                                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginTop: 10, paddingHorizontal: 10 }}
                                    keyboardType="phone-pad"
                                    value={contact}
                                    onChangeText={text => setContact(text)}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: '#fecd00', width: '50%', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 10, alignSelf: 'center', marginTop: 35, elevation: 2 }}
                            onPress={() => sendInvitation()}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Send Invitation</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {requestTitle === "Video Wish" && (
                    <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: theme.textColor, marginTop: 100, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontSize: 22 }}>Best Wishes!!!{'\n'}
                                <Text style={{ fontSize: 18, width: '80%' }}>Your celebrity is just 1 click away.
                                </Text>
                            </Text>
                            <TouchableOpacity onPress={toggleModal}>
                                <AntDesign name='closecircle' size={22} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column', marginTop: 25, paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 18 }}>Wishes for</Text>
                                <DropDownPicker
                                    open={open3}
                                    value={wishType}
                                    items={items}
                                    setOpen={setOpen3}
                                    setValue={setWishType}
                                    setItems={setItems}
                                    containerStyle={{ width: '70%', marginTop: 10 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginTop: 20 }}>
                                <Text style={{ fontSize: 18 }}>Message</Text>
                                <Text style={{ fontSize: 16, marginTop: 5 }}>What should {targetUsername} wish him/her about?</Text>
                                <TextInput
                                    style={{ borderColor: 'gray', borderWidth: 1, fontSize: 16, marginTop: 10, paddingHorizontal: 10, borderRadius: 10 }}
                                    multiline={true}
                                    value={wishMessage}
                                    onChangeText={text => setWishMessage(text)}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: '#fecd00', width: '50%', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 10, alignSelf: 'center', marginTop: 35, elevation: 2 }}
                            onPress={() => sendInvitation()}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Send Invitation</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {requestTitle === "Custom Message" && (
                    <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: theme.textColor, marginTop: 100, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontSize: 22 }}>Custom Message!!!{'\n'}
                                <Text style={{ fontSize: 18, width: '80%' }}>Your celebrity is just 1 click away.
                                </Text>
                            </Text>
                            <TouchableOpacity onPress={toggleModal}>
                                <AntDesign name='closecircle' size={22} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column', marginTop: 25, paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'column', marginTop: 20 }}>
                                <Text style={{ fontSize: 18 }}>Request</Text>
                                <TextInput
                                    style={{ borderColor: 'gray', borderWidth: 1, fontSize: 16, marginTop: 10, paddingHorizontal: 10, borderRadius: 10 }}
                                    multiline={true}
                                    value={customRequest}
                                    onChangeText={text => setCustomRequest(text)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginTop: 20 }}>
                                <Text style={{ fontSize: 18 }}>Additional Information</Text>
                                <TextInput
                                    style={{ borderColor: 'gray', borderWidth: 1, fontSize: 16, marginTop: 10, paddingHorizontal: 10, borderRadius: 10 }}
                                    multiline={true}
                                    value={customRequestInfo}
                                    onChangeText={text => setCustomRequestInfo(text)}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: '#fecd00', width: '50%', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 10, alignSelf: 'center', marginTop: 35, elevation: 2 }}
                            onPress={() => sendInvitation()}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Send Invitation</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </Modal>
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
    quickReplyContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    quickReplyButton: {
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#DDDDDD',
        borderRadius: 10,
    },
    quickReplyText: {
        fontSize: 16,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    }
})