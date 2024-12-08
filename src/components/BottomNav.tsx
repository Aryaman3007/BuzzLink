import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MessageScreen from '../Screens/MessageScreen/MessageScreen.tsx';
import { Colors } from '../Styles';
import { CardStyleInterpolators, TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../Screens/ChatScreen/ChatScreen.tsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ZegoUIKitPrebuiltCallWaitingScreen, ZegoUIKitPrebuiltCallInCallScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import HomeStack from '../navigation/HomeStack.tsx';
import SearchScreen from '../Screens/SearchScreen/SearchScreen.tsx';
import NewHomeScreen from '../Screens/NewHomeScreen/NewHomeScreen';
import RisingStar from '../Screens/NewHomeScreen/RisingStar';
import MyBalance from '../Screens/HomeScreen/MyBalance';
import MyBalance1 from '../Screens/HomeScreen/MyBalance1';
import BuyCoin from '../Screens/CoinScreen/BuyCoin.tsx';
import YourTopics from '../Screens/WaitingCalls/YourTopics.tsx';
import InterestedUsersScreen from '../Screens/WaitingCalls/InterestedUsersScreen.tsx';
import SettingScreen from '../Screens/SettingScreen/SettingScreen.tsx';
import ProfileScreen from '../Screens/ProfileScreen/ProfileScreen';
import Report from '../Screens/TweetScreen/Report';
import VisitProfile from '../Screens/VisitProfile/VisitProfile.tsx';
import QrCode from '../Screens/ProfileScreen/QrCode.tsx';
import EditScreen from '../Screens/ProfileScreen/EditScreen.tsx';
import ContactUs from '../Screens/SettingScreen/ContactUs.tsx';
import FAQ from '../Screens/SettingScreen/FAQ.tsx';
import MessageReport from '../Screens/MessageScreen/MessageReport.tsx';
import BlockListScreen from '../Screens/SettingScreen/BlockListScreen.tsx';
import { useCurrentUser } from '../context/UserContext.tsx';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import { ThemeContext } from '../context/ThemeContext.tsx';
import ZegoUIKitPrebuiltCallService, { ZegoSendCallInvitationButton, ONE_ON_ONE_AUDIO_CALL_CONFIG, ZegoMenuBarButtonName } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import AnimatedIconWrapper from './AnimatedIconWrapper.tsx';
import CreatorStudio from '../Screens/SettingScreen/CreatorStudio.tsx';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSelectedUser } from '../context/SelectedUserProvider.tsx';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../context/AuthProvider.tsx';
import CelebsInfo from '../Screens/NewHomeScreen/CelebsInfo.tsx';
import ChatBot from '../Screens/NewHomeScreen/ChatBot.tsx';
import { BottomSheet } from 'react-native-sheet';
import RequestsScreen from '../Screens/SettingScreen/RequestsScreen.tsx';
import BankDetails from '../Screens/HomeScreen/BankDetails.tsx';
import AddBankDetails from '../Screens/HomeScreen/AddBankDetails.tsx';

const Stack = createStackNavigator()

const Tab = createBottomTabNavigator()

export default function BottomNav() {

    const navigation = useNavigation()
    const { isDarkMode } = useContext(ThemeContext);

    const [rating, setRating] = useState(0);
    const [selectedStarCount, setSelectedStarCount] = useState(0);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedDollar, setSelectedDollar] = useState(null);
    const [isInputVisible, setInputVisible] = useState<boolean>(false);
    const [customAmount, setCustomAmount] = useState<string>('');
    const bottomSheet = useRef(null);

    const handleDollarPress = (dollar) => {
        if (selectedDollar === dollar) {
            setSelectedDollar(null);
        } else {
            setSelectedDollar(dollar);
        }
    };

    const toggleInputVisibility = () => {
        setInputVisible(!isInputVisible);
    };


    const handleStarPress = (stars) => {
        if (stars === selectedStarCount) {
            setRating(0);
            setSelectedStarCount(0);
        } else {
            setRating(stars);
            setSelectedStarCount(stars);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleStarPress(i)} style={{ marginHorizontal: 7 }}>
                    <FontAwesome
                        name={i <= rating ? 'star' : 'star-o'}
                        size={42}
                        color={i <= rating ? 'orange' : 'gray'}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const getRatingText = (starCount) => {
        switch (starCount) {
            case 1:
                return "POOR";
            case 2:
                return "FAIR";
            case 3:
                return "GOOD";
            case 4:
                return "EXCELLENT";
            case 5:
                return "AWESOME";
            default:
                return "RATING!";
        }
    };

    const openBottomSheet = () => {
        console.log('////////////////////////////////')
        setBottomSheetVisible(true);
    };

    // Function to close the bottom sheet
    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    const lightTheme = {
        backgroundColor: Colors.light,
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
        borderColor: 'grey',
        bottomSheetBack: 'white'
    };

    const darkTheme = {
        backgroundColor: Colors.profileBlack,
        textColor: Colors.light,
        iconColor: '#666',
        borderColor: 'grey',
        bottomSheetBack: '#333333'
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    const { user } = useContext(AuthContext)

    const currentUser = useCurrentUser()

    const checkIfCurrentUserIsInfluencer = async (userID) => {
        try {
            const influencerDoc = await firestore().collection('influencers').doc(userID).get();
            return influencerDoc.exists;
        } catch (error) {
            console.error('Error checking if currentUser is an influencer:', error);
            return false;
        }
    };

    const addInfluencerEarningsRecord = async (callUserId, duration) => {
        try {
            const currentuid = user?.uid;
            await firestore().collection('earnings').add({
                userId: currentuid,
                targetUserId: callUserId,
                cpm: 30,
                timestamp: new Date(),
                date: new Date().getDate(),
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                earningType: "UserRequest"
            });
            console.log('Influencer earnings record added successfully');
        } catch (error) {
            console.error('Error adding influencer earnings record:', error);
        }
    };


    const addInfluencerCallRecord = async (callUserId, duration) => {
        console.log('Function Called');
        console.log('callUserId:', callUserId);

        const currentuid = user?.uid;
        const isInfluencer = await checkIfCurrentUserIsInfluencer(currentuid);
        console.log('isInfluencer:', isInfluencer);
        console.log('currentuid:', currentuid);
        console.log('duration:', duration);
        console.log('callUserId:', callUserId);
        if (isInfluencer) {
            const response = await firestore().collection('influencerCalls').add({
                userId: currentuid,
                targetUserId: callUserId,
                duration: duration,
                timestamp: new Date(),
                date: new Date().getDate(),
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                cpm: 30
            });
            console.log('Influencer call record added successfully:', response);
            await addInfluencerEarningsRecord(callUserId, duration);
        } else {
            console.log('User is not an influencer');
        }

    };

    const showBottomSheet = () => {
        console.log('//////////////////////')
        bottomSheet.current?.show();
    }

    ZegoUIKitPrebuiltCallService.init(
        869286775,
        '27736466eb05c969614ac30d11bb925defab9d0b12771891ff0ab9cef0fec3be',
        currentUser?.userId,
        currentUser?.username,
        [ZIM, ZPNs],
        {
            innerText: {
                incomingVoiceCallDialogTitle: "%0",
                incomingVoiceCallDialogMessage: "Incoming voice call...",
            },
            onIncomingCallDeclineButtonPressed: () => {
                console.log('**************************Call hangup')
            },
            androidNotificationConfig: {
                channelID: "zego_call",
                channelName: "zego_call",
            },
            ringtoneConfig: {
                incomingCallFileName: 'zego_incoming.mp3',
                outgoingCallFileName: 'zego_outgoing.mp3',
            },
            showMicrophoneStateOnView: false,
            showCameraStateOnView: false,
            showUserNameOnView: false,
            notifyWhenAppRunningInBackgroundOrQuit: false,
            requireConfig: data => {
                return {
                    ...ONE_ON_ONE_AUDIO_CALL_CONFIG,
                    hangUpConfirmInfo: {
                        title: "Hangup confirm",
                        message: "Do you want to hangup?",
                        cancelButtonName: "Cancel",
                        confirmButtonName: "Confirm"
                    },
                    turnOnCameraWhenJoining: false,
                    turnOnMicrophoneWhenJoining: true,
                    useSpeakerWhenJoining: true,
                    bottomMenuBarConfig: {
                        maxCount: 3,
                        buttons: [
                            ZegoMenuBarButtonName.toggleMicrophoneButton,
                            ZegoMenuBarButtonName.hangUpButton,
                            ZegoMenuBarButtonName.switchAudioOutputButton,
                        ],
                    },
                    // timingConfig: {
                    //     isDurationVisible: true,
                    //     onDurationUpdate: (duration) => {
                    //         console.log('########CallWithInvitation onDurationUpdate', duration);
                    //         if (duration === 1 * 60) {
                    //             ZegoUIKitPrebuiltCallService.hangUp();
                    //         }
                    //     }
                    // },
                    onHangUp: duration => {
                        console.log('*********Call hang-up:', duration)
                        console.log('*********selectedUSerData:', data.invitees[0]);
                        //addInfluencerCallRecord(selectedUserData?.userId, duration);
                        (async () => {
                            await addInfluencerCallRecord(data.invitees[0], duration);
                        })();

                        //ZegoUIKitPrebuiltCallService.hangUp();
                        //showBottomSheet();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'NewHome', params: { data: data.invitees[0] } }]
                        })
                        console.log('ONHANGUP')
                    },
                    // onHangUp: duration => {
                    //     console.log('*********Call hang-up:', duration)
                    // },
                    avatarBuilder: () => {
                        return (<View style={{ width: '100%', height: '100%' }}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                                source={require('../assets/avatar.jpg')}
                            />
                        </View>
                        )
                    },
                }
            }
        }
    )


    const MessageStack = ({ navigation }) => (
        <Stack.Navigator>
            <Stack.Screen name='Message' component={MessageScreen} options={{ headerShown: false }} />
            <Stack.Screen options={() => ({
                headerShown: false
            })} name='Chat' component={ChatScreen} />
            <Stack.Screen name='VisitProfile' component={VisitProfile} options={{ headerShown: false }} />
            <Stack.Screen
                options={{ headerShown: false }}
                // DO NOT change the name 
                name="ZegoUIKitPrebuiltCallWaitingScreen"
                component={ZegoUIKitPrebuiltCallWaitingScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                // DO NOT change the name
                name="ZegoUIKitPrebuiltCallInCallScreen"
                component={ZegoUIKitPrebuiltCallInCallScreen}
            />

            <Stack.Screen name='MessageReport' component={MessageReport} options={{ headerShown: false }} />

        </Stack.Navigator>
    )

    /* useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation]); */

    const WaitingCallStack = () => (
        <Stack.Navigator>
            <Stack.Screen name='YourTopics' component={YourTopics} options={{ headerShown: false }} />
            <Stack.Screen name='VisitProfile' component={VisitProfile} options={{ headerShown: false }} />
            <Stack.Screen
                options={{ headerShown: false }}
                // DO NOT change the name 
                name="ZegoUIKitPrebuiltCallWaitingScreen"
                component={ZegoUIKitPrebuiltCallWaitingScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                // DO NOT change the name
                name="ZegoUIKitPrebuiltCallInCallScreen"
                component={ZegoUIKitPrebuiltCallInCallScreen}
            />
            <Stack.Screen name='NewHome' component={NewHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='InterestedUsersScreen' component={InterestedUsersScreen} options={{ headerShown: false }} />
            <Stack.Screen name='SettingsScreen' component={SettingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )

    const NewHomeStack = ({ navigation }) => (
        <Stack.Navigator>
            <Stack.Screen name='NewHome' component={NewHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Celebs' component={CelebsInfo} options={{ headerShown: false }} />
            <Stack.Screen name='ChatBot' component={ChatBot} options={{ headerShown: false }} />
            <Stack.Screen
                options={{ headerShown: false }}
                // DO NOT change the name 
                name="ZegoUIKitPrebuiltCallWaitingScreen"
                component={ZegoUIKitPrebuiltCallWaitingScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                // DO NOT change the name
                name="ZegoUIKitPrebuiltCallInCallScreen"
                component={ZegoUIKitPrebuiltCallInCallScreen}
            />
            <Stack.Screen name='YourTopics' component={YourTopics} options={{ headerShown: false }} />
            <Stack.Screen name='Search' component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name='RisingStar' component={RisingStar} options={{ headerShown: false }} />
            <Stack.Screen name='MyBalance' component={MyBalance} options={{ headerShown: false }} />
            <Stack.Screen name='MyBalance1' component={MyBalance1} options={{ headerShown: false }} />
            <Stack.Screen name='BankDetails' component={BankDetails} options={{ headerShown: false }} />
            <Stack.Screen name='AddBankDetails' component={AddBankDetails} options={{ headerShown: false }} />
            <Stack.Screen name='BuyCoin' component={BuyCoin} options={{ headerShown: false }} />
            <Stack.Screen name='InterestedUsersScreen' component={InterestedUsersScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Report' component={Report} options={{ headerShown: false }} />
            <Stack.Screen name='VisitProfile' component={VisitProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    )

    const ProfileStack = ({ navigation }) => {
        return (
            <Stack.Navigator>
                <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name='MyBalance1' component={MyBalance1} options={{ headerShown: false }} />
                <Stack.Screen name='MyBalance' component={MyBalance} options={{ headerShown: false }} />
                <Stack.Screen name='Settings' component={SettingScreen} options={{ headerShown: false }} />
                <Stack.Screen name='Block' component={BlockListScreen} options={{ headerShown: false }} />
                <Stack.Screen name='QrCode' component={QrCode} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                    ...TransitionPresets.ModalPresentationIOS
                }} />
                <Stack.Screen name='EditScreen' component={EditScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
                <Stack.Screen name='ContactUs' component={ContactUs} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
                <Stack.Screen name='FAQ' component={FAQ} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
                <Stack.Screen name='CreatorStudio' component={CreatorStudio} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
                <Stack.Screen name='Requests' component={RequestsScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
                <Stack.Screen
                    options={{ headerShown: false }}
                    // DO NOT change the name 
                    name="ZegoUIKitPrebuiltCallWaitingScreen"
                    component={ZegoUIKitPrebuiltCallWaitingScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    // DO NOT change the name
                    name="ZegoUIKitPrebuiltCallInCallScreen"
                    component={ZegoUIKitPrebuiltCallInCallScreen}
                />
                <Stack.Screen name='NewHome' component={NewHomeScreen} options={{ headerShown: false }} />
                {/* <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} /> */}
            </Stack.Navigator>
        )
    }

    const iconMap = {
        Home: { focused: 'home', unfocused: 'home-outline' },
        Hub: { focused: 'people', unfocused: 'people-outline' },
        Features: { focused: 'call', unfocused: 'call-outline' },
        Messages: { focused: 'chatbubble-ellipses', unfocused: 'chatbubble-ellipses-outline' },
        Profile: { focused: 'user', unfocused: 'user-o' }
    };

    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, focused }) => {
                    const iconName = focused ? iconMap[route.name].focused : iconMap[route.name].unfocused;
                    let IconComponent = FontAwesome; // Default icon component is FontAwesome, change as needed

                    // Choose icon component based on route name
                    if (route.name === 'Home') {
                        IconComponent = Ionicons;
                    } else if (route.name === 'Hub') {
                        IconComponent = Ionicons; // Example custom icon component
                    }
                    else if (route.name === 'Features') {
                        return (
                            <AnimatedIconWrapper
                                iconSize={30}
                                gradientColors={['cyan', 'blue']} // Gradient colors for Features route
                                iconColor={theme.textColor}
                                iconName={iconName}
                            />
                        );
                    }
                    else if (route.name === 'Messages') {
                        IconComponent = Ionicons; // Example custom icon component
                    }
                    else if (route.name === 'Profile') {
                        IconComponent = FontAwesome; // Example custom icon component
                    }

                    return <IconComponent name={iconName} size={27} color={theme.textColor} />;
                },
                tabBarLabel: '',
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: 'grey',
                tabBarStyle: [styles.tabBarStyle, { backgroundColor: theme.backgroundColor }],
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarVisible: route.name !== 'Features'
            })}
        >
            <Tab.Screen name='Home' component={NewHomeStack} />
            <Tab.Screen name='Hub' component={HomeStack} />
            <Tab.Screen name='Features' component={WaitingCallStack} options={{ tabBarStyle: { display: 'none' } }} />
            <Tab.Screen name='Messages' component={MessageStack} options={{ tabBarStyle: { display: 'none' } }} />
            <Tab.Screen name='Profile' component={ProfileStack} />
        </Tab.Navigator>

    )
}

const styles = StyleSheet.create({
    tabBarStyle: {
        position: 'absolute',
        paddingVertical: 8,
        paddingHorizontal: 5
    },
    middleCall: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "black",
        overflow: 'hidden',
        top: -35,
        borderWidth: 6,
        borderColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
    }
})