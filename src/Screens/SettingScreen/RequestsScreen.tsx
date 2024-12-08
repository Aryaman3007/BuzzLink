import { StyleSheet, Text, TouchableOpacity, View, Animated, ScrollView, Image, Modal, FlatList, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { ThemeContext } from '../../context/ThemeContext';
import { Colors } from '../../Styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthProvider';
import { useCurrentUser } from '../../context/UserContext';
import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { LongPressGestureHandler, State, Swipeable } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker'
import { Pressable } from 'react-native';

export default function RequestsScreen() {

    const { isDarkMode } = useContext(ThemeContext);

    const lightTheme = {
        backgroundColor: Colors.light,
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
        aboutText: '#876370',
        sheetBlack: 'white'
    };

    const darkTheme = {
        backgroundColor: Colors.profileBlack,
        textColor: Colors.light,
        iconColor: '#666',
        aboutText: '#876370',
        sheetBlack: 'black'
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const navigation = useNavigation();
    const { user } = useContext(AuthContext)
    const currentUser = useCurrentUser()

    const [activeTab, setActiveTab] = useState('Invite'); // State to track active tab
    const [slideAnim] = useState(new Animated.Value(0));
    const [inviteRequests, setInviteRequests] = useState([]);
    const [wishRequests, setWishRequests] = useState([]);
    const [customRequests, setCustomRequests] = useState([]);
    const [inviteTodayRequests, setInviteTodayRequests] = useState([]);
    const [wishTodayRequests, setWishTodayRequests] = useState([]);
    const [customTodayRequests, setCustomTodayRequests] = useState([]);
    const [inviteYesterdayRequests, setInviteYesterdayRequests] = useState([]);
    const [wishYesterdayRequests, setWishYesterdayRequests] = useState([]);
    const [customYesterdayRequests, setCustomYesterdayRequests] = useState([]);
    const [inviteLast7Requests, setInviteLast7Requests] = useState([]);
    const [wishLast7Requests, setWishLast7Requests] = useState([]);
    const [customLast7Requests, setCustomLast7Requests] = useState([]);

    const options1 = ['Today', 'Last 7 days', 'Last 30 days'];
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [selectedOption1, setSelectedOption1] = useState('Today');
    const [todayInvites, setTodayInvites] = useState(0)
    const [todayWishes, setTodayWishes] = useState(0)
    const [todayCustoms, setTodayCustoms] = useState(0)
    const [last7daysInvites, setlast7daysInvites] = useState(0)
    const [last7daysWishes, setlast7daysWishes] = useState(0)
    const [last7daysCustoms, setlast7daysCustoms] = useState(0)
    const [last30daysInvites, setlast30daysInvites] = useState(0)
    const [last30daysWishes, setlast30daysWishes] = useState(0)
    const [last30daysCustoms, setlast30daysCustoms] = useState(0)

    const [yesterdayInvite, setYesterdayInvite] = useState(0);
    const [yesterdayWish, setYesterdayWish] = useState(0);
    const [yesterdayCustom, setYesterdayCustom] = useState(0);


    const today = new Date();
    const lastSevenDatesOG = [];
    const lastSevenDatesMonth = [];
    const lastSevenDatesYear = [];

    const lastThirtyDatesOG = [];
    const lastThirtyDatesMonth = [];
    const lastThirtyDatesYear = [];
    const [showModal, setShowModal] = useState(false);
    const [requestTime, setRequestTime] = useState('');

    const [filteredRequests, setFilteredRequests] = useState([]);

    const filterRequestsByTime = (time) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        switch (time) {
            case 'Today':
                setFilteredRequests(inviteRequests.filter(request => {
                    return (
                        request.date === today.getDate() &&
                        request.month === today.getMonth() &&
                        request.year === today.getFullYear()
                    );
                }));
                break;
            case 'Yesterday':
                setFilteredRequests(inviteRequests.filter(request => {
                    return (
                        request.date === yesterday.getDate() &&
                        request.month === yesterday.getMonth() &&
                        request.year === yesterday.getFullYear()
                    );
                }));
                break;
            default:
                setFilteredRequests(inviteRequests);
                break;
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        filterRequestsByTime(requestTime);
    };


    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        lastSevenDatesOG.push(date.getDate())
        lastSevenDatesMonth.push(date.getMonth())
        lastSevenDatesYear.push(date.getFullYear())
    }

    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        lastThirtyDatesOG.push(date.getDate());
        lastThirtyDatesMonth.push(date.getMonth())
        lastThirtyDatesYear.push(date.getFullYear())
    }

    const handleOptionSelect1 = (option) => {
        setSelectedOption1(option);
        setShowDropdown1(false);
    };

    const toggleDropdown1 = () => {
        setShowDropdown1(!showDropdown1);
    };

    const handleAccept = async (requestId) => {
        try {
            await firestore().collection('requests').doc(requestId).update({
                isAccepted: true
            });

        } catch (error) {
            Alert.alert('Error', 'Failed to accept request. Please try again later.');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await firestore().collection('requests').doc(requestId).update({
                isRejected: true
            });

            Toast.show({
                type: 'success',
                text1: 'Request Rejected',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to reject request. Please try again later.');
        }
    };

    const RequestCard = ({ request }) => {

        const handleAcceptRequest = async () => {
            Alert.alert(
                'Confirm Acceptance',
                'Are you sure you want to accept this request?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Accept',
                        onPress: async () => {
                            try {
                                handleAccept(request.id)
                                const expiresAt = new Date();
                                expiresAt.setDate(expiresAt.getDate() + 7);
                                await firestore().collection('ongoingRequests').add({
                                    requestId: request.senderId,
                                    acceptedAt: new Date(),
                                    isDelivered: 'No',
                                    requestType: request.requestType,
                                    expiresAt: expiresAt,
                                    coins: request.coin,
                                    requestedAt: request.createdAt,
                                });


                                Toast.show({
                                    type: 'success',
                                    text1: 'Request Accepted',
                                    text2: 'The request has been moved to ongoing requests.',
                                });
                            } catch (error) {
                                Alert.alert('Error', 'Failed to accept request. Please try again later.');
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        };

        const handleRejectRequest = async () => {
            Alert.alert(
                'Confirm Acceptance',
                'Are you sure you want to reject this request?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Reject',
                        onPress: async () => {
                            try {
                                handleReject(request.id)

                                Toast.show({
                                    type: 'success',
                                    text1: 'Request Rejected',
                                });
                            } catch (error) {
                                Alert.alert('Error', 'Failed to accept request. Please try again later.');
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        };

        const leftSwipe = () => {
            return (
                <View
                    style={{ flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center' }}
                >
                </View>
            );
        };
        const rightSwipe = () => {
            return (
                <View
                    style={{
                        flex: 1, backgroundColor: '#ff3333', justifyContent: 'center'
                    }}
                >

                </View>
            );
        };

        const [isPressed, setIsPressed] = useState(false);

        const onLongPress = (event) => {
            if (event.nativeEvent.state === State.ACTIVE) {
                setIsPressed(true);
            }
        };

        return (
            <LongPressGestureHandler
                onHandlerStateChange={onLongPress}
                minDurationMs={500}
            >
                <View>
                    <Swipeable
                        renderLeftActions={leftSwipe}
                        renderRightActions={rightSwipe}
                        onSwipeableLeftOpen={handleAcceptRequest}
                        onSwipeableRightOpen={handleRejectRequest}>
                        <View style={{ width: '100%', height: 80, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, backgroundColor: isPressed ? '#d3d3d3' : theme.backgroundColor }}>
                            <View style={{ flexDirection: 'row', width: '80%' }}>
                                <Image source={require('../../assets/avatar.jpg')} style={{ height: 50, width: 50, borderRadius: 25, alignSelf: 'center' }} />
                                <View style={{ flexDirection: 'column', marginLeft: 15, alignSelf: 'center' }}>
                                    <Text style={{ color: theme.textColor, fontSize: 16, fontWeight: '600' }}>Wish: {request.requestType}</Text>
                                    <Text style={{ color: '#7f7f7f', fontSize: 13 }}>requested: {request.date}/{request.month}/{request.year}</Text>
                                    <Text style={{ color: '#7f7f7f', fontSize: 13, marginTop: -2 }}>expected by: 02/04/24 </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, marginTop: 5 }}>{request.coin}$</Text>
                            </View>
                        </View>
                    </Swipeable>
                </View>
            </LongPressGestureHandler>
        );
    };

    useEffect(() => {
        const fetchTodayInvites = async () => {
            const today = new Date();
            const querySnapshot = await firestore()
                .collection('requests')
                .where('influencerId', '==', user.uid)
                .where('requestType', '==', 'Invite for an event')
                .where('date', '==', today.getDate())
                .where('month', '==', today.getMonth())
                .where('year', '==', today.getFullYear())
                .get();

            setTodayInvites(querySnapshot.size)
        };

        const fetchTodayWishes = async () => {
            const today = new Date();
            const querySnapshot = await firestore()
                .collection('requests')
                .where('influencerId', '==', user.uid)
                .where('requestType', '==', 'Video Wish')
                .where('date', '==', today.getDate())
                .where('month', '==', today.getMonth())
                .where('year', '==', today.getFullYear())
                .get();

            setTodayWishes(querySnapshot.size)
        };
        const fetchTodayCustoms = async () => {
            const today = new Date();
            const querySnapshot = await firestore()
                .collection('requests')
                .where('influencerId', '==', user.uid)
                .where('requestType', '==', 'Custom Message')
                .where('date', '==', today.getDate())
                .where('month', '==', today.getMonth())
                .where('year', '==', today.getFullYear())
                .get();

            setTodayCustoms(querySnapshot.size)
        };

        fetchTodayInvites();
        fetchTodayWishes();
        fetchTodayCustoms();
    }), [user]

    const filterRequestsByDate = (requestsData, targetDate) => {
        return requestsData.filter(request => {
            const requestDate = new Date(request.year, request.month, request.date);
            return requestDate >= targetDate && requestDate <= new Date();
        });
    };

    const filterRequestsByTypeAndDate = (requestsData, targetType, targetDate) => {
        return requestsData.filter(request => {
            return (
                request.requestType === targetType &&
                request.date === targetDate.getDate() &&
                request.month === targetDate.getMonth() &&
                request.year === targetDate.getFullYear()
            );
        });
    };

    const fetchRequests = async () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const snapshot = await firestore().collection('requests').where('influencerId', '==', user.uid).where('isAccepted', '==', false).where('isRejected', '==', false).get();
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const inviteRequestsData = requests.filter(request => request.requestType === 'Invite for an event');
        const wishRequestsData = requests.filter(request => request.requestType === 'Video Wish');
        const customRequestsData = requests.filter(request => request.requestType === 'Custom Message');

        const inviteTodayRequestsData = filterRequestsByTypeAndDate(inviteRequestsData, 'Invite for an event', today);
        const wishTodayRequestsData = filterRequestsByTypeAndDate(wishRequestsData, 'Video Wish', today);
        const customTodayRequestsData = filterRequestsByTypeAndDate(customRequestsData, 'Custom Message', today);

        const inviteYesterdayRequestsData = filterRequestsByTypeAndDate(inviteRequestsData, 'Invite for an event', yesterday);
        const wishYesterdayRequestsData = filterRequestsByTypeAndDate(wishRequestsData, 'Video Wish', yesterday);
        const customYesterdayRequestsData = filterRequestsByTypeAndDate(customRequestsData, 'Custom Message', yesterday);

        const inviteLast7DaysRequestsData = filterRequestsByDate(inviteRequestsData, sevenDaysAgo);
        const wishLast7DaysRequestsData = filterRequestsByDate(wishRequestsData, sevenDaysAgo);
        const customLast7DaysRequestsData = filterRequestsByDate(customRequestsData, sevenDaysAgo);

        setInviteRequests(inviteRequestsData);
        setWishRequests(wishRequestsData);
        setCustomRequests(customRequestsData);
        setInviteTodayRequests(inviteTodayRequestsData);
        setWishTodayRequests(wishTodayRequestsData);
        setCustomTodayRequests(customTodayRequestsData);
        setInviteYesterdayRequests(inviteYesterdayRequestsData);
        setWishYesterdayRequests(wishYesterdayRequestsData);
        setCustomYesterdayRequests(customYesterdayRequestsData);
        setInviteLast7Requests(inviteLast7DaysRequestsData);
        setWishLast7Requests(wishLast7DaysRequestsData);
        setCustomLast7Requests(customLast7DaysRequestsData);
    };

    useEffect(() => {
        const fetchYesterdayRequests = async () => {
            const yesterday = new Date(today)
            yesterday.setDate(today.getDate() - 1);
            const snapshot = await firestore().collection('requests').where('influencerId', '==', user.uid).get();
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const inviteRequestsData = requests.filter(request => request.requestType === 'Invite for an event');
            const wishRequestsData = requests.filter(request => request.requestType === 'Video Wish');
            const customRequestsData = requests.filter(request => request.requestType === 'Custom Message');

            const inviteYesterdayRequestsData = inviteRequestsData.filter(request => {
                return (
                    request.date === yesterday.getDate() &&
                    request.month === yesterday.getMonth() &&
                    request.year === yesterday.getFullYear()
                );
            });

            const wishYesterdayRequestsData = wishRequestsData.filter(request => {
                return (
                    request.date === yesterday.getDate() &&
                    request.month === yesterday.getMonth() &&
                    request.year === yesterday.getFullYear()
                );
            });

            const customYesterdayRequestsData = customRequestsData.filter(request => {
                return (
                    request.date === yesterday.getDate() &&
                    request.month === yesterday.getMonth() &&
                    request.year === yesterday.getFullYear()
                );
            });

            setYesterdayInvite(inviteYesterdayRequestsData.length);
            setYesterdayWish(wishYesterdayRequestsData.length);
            setYesterdayCustom(customYesterdayRequestsData.length);
        }

        fetchYesterdayRequests();
    }, [])

    const fetchLastSevenDaysData = async () => {
        let last7daysInvitesdata = 0;
        let last7daysWishesdata = 0;
        let last7daysCustomdata = 0;

        const inviteSnapshot = await firestore()
            .collection('requests')
            .where('influencerId', '==', user.uid)
            .where('requestType', '==', 'Invite for an event')
            .get()

        inviteSnapshot.forEach((doc) => {
            const requestDate = Number(doc.data().date);
            const requestMonth = Number(doc.data().month);
            const requestYear = Number(doc.data().year);
            if (lastSevenDatesOG.includes(requestDate) && lastSevenDatesMonth.includes(requestMonth) && lastSevenDatesYear.includes(requestYear)) {
                last7daysInvitesdata++;
            }
        })

        const wishSnapshot = await firestore()
            .collection('requests')
            .where('influencerId', '==', user.uid)
            .where('requestType', '==', 'Video Wish')
            .get();

        wishSnapshot.forEach((doc) => {
            const requestDate = Number(doc.data().date);
            const requestMonth = Number(doc.data().month);
            const requestYear = Number(doc.data().year);
            if (lastSevenDatesOG.includes(requestDate) && lastSevenDatesMonth.includes(requestMonth) && lastSevenDatesYear.includes(requestYear)) {
                last7daysWishesdata++;
            }
        });

        const customSnapshot = await firestore()
            .collection('requests')
            .where('influencerId', '==', user.uid)
            .where('requestType', '==', 'Custom Message')
            .get();

        customSnapshot.forEach((doc) => {
            const requestDate = Number(doc.data().date);
            const requestMonth = Number(doc.data().month);
            const requestYear = Number(doc.data().year);
            if (lastSevenDatesOG.includes(requestDate) && lastSevenDatesMonth.includes(requestMonth) && lastSevenDatesYear.includes(requestYear)) {
                last7daysCustomdata++;
            }
        });

        setlast7daysInvites(last7daysInvitesdata);
        setlast7daysWishes(last7daysWishesdata);
        setlast7daysCustoms(last7daysCustomdata);
    }

    const fetchLastThirtyDaysData = async () => {
        let last30daysInvitesdata = 0;
        let last30daysWishesdata = 0;
        let last30daysCustomdata = 0;

        const inviteSnapshot = await firestore()
            .collection('requests')
            .where('influencerId', '==', user.uid)
            .where('requestType', '==', 'Invite for an event')
            .get()

        inviteSnapshot.forEach((doc) => {
            const requestDate = Number(doc.data().date);
            const requestMonth = Number(doc.data().month);
            const requestYear = Number(doc.data().year);
            if (lastThirtyDatesOG.includes(requestDate) && lastThirtyDatesMonth.includes(requestMonth) && lastThirtyDatesYear.includes(requestYear)) {
                last30daysInvitesdata++;
            }
        })

        const wishSnapshot = await firestore()
            .collection('requests')
            .where('influencerId', '==', user.uid)
            .where('requestType', '==', 'Video Wish')
            .get();

        wishSnapshot.forEach((doc) => {
            const requestDate = Number(doc.data().date);
            const requestMonth = Number(doc.data().month);
            const requestYear = Number(doc.data().year);
            if (lastThirtyDatesOG.includes(requestDate) && lastThirtyDatesMonth.includes(requestMonth) && lastThirtyDatesYear.includes(requestYear)) {
                last30daysWishesdata++;
            }
        });

        const customSnapshot = await firestore()
            .collection('requests')
            .where('influencerId', '==', user.uid)
            .where('requestType', '==', 'Custom Message')
            .get();

        customSnapshot.forEach((doc) => {
            const requestDate = Number(doc.data().date);
            const requestMonth = Number(doc.data().month);
            const requestYear = Number(doc.data().year);
            if (lastThirtyDatesOG.includes(requestDate) && lastThirtyDatesMonth.includes(requestMonth) && lastThirtyDatesYear.includes(requestYear)) {
                last30daysCustomdata++;
            }
        });

        setlast30daysInvites(last30daysInvitesdata);
        setlast30daysWishes(last30daysWishesdata);
        setlast30daysCustoms(last30daysCustomdata);
    }

    useEffect(() => {
        fetchLastSevenDaysData();
        fetchLastThirtyDaysData();

        /*  const unsubscribe = firestore().collection('requests').onSnapshot(snapshot => {
             fetchRequests();
         });
 
         return () => unsubscribe(); */
    }, [user])

    useEffect(() => {
        fetchRequests();

        const unsubscribe = firestore().collection('requests').onSnapshot(snapshot => {
            fetchRequests();
        });

        return () => unsubscribe();
    }, [user]);

    const animateSlider = (index) => {
        Animated.timing(slideAnim, {
            toValue: index,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        switch (activeTab) {
            case 'Invite':
                animateSlider(0);
                break;
            case 'Wish':
                animateSlider(1);
                break;
            case 'Custom':
                animateSlider(2);
                break;
            default:
                break;
        }
    }, [activeTab]);

    const slidePosition = slideAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: ['0%', '25%', '50%'],
    });

    const renderRequestItem = ({ item }) => {
        return (
            <RequestCard request={item} />
        );
    };

    const [percentInviteToday, setPercentInviteToday] = useState(0)
    const [percentWishToday, setPercentWishToday] = useState(0)
    const [percentCustomToday, setPercentCustomToday] = useState(0)

    useEffect(() => {

        const calculatepercentInviteToday = () => {
            if (yesterdayInvite === todayInvites) {
                setPercentInviteToday(0)
            } else if (yesterdayInvite !== 0 && todayInvites !== 0) {
                const change1 = (((todayInvites - yesterdayInvite) / yesterdayInvite) * 100).toFixed(1);
                setPercentInviteToday(change1)
            } else if (yesterdayInvite === 0) {
                setPercentInviteToday(todayCustoms * 100)
            } else if (todayInvites === 0) {
                setPercentInviteToday(yesterdayInvite * -100)
            }
        }

        const calculatepercentWishToday = () => {
            if (yesterdayWish === todayWishes) {
                setPercentWishToday(0)
            } else if (yesterdayInvite !== 0 && todayWishes !== 0) {
                const change1 = (((todayWishes - yesterdayWish) / yesterdayWish) * 100).toFixed(1);
                setPercentWishToday(change1)
            } else if (yesterdayWish === 0) {
                setPercentWishToday(todayWishes * 100)
            } else if (todayWishes === 0) {
                setPercentWishToday(yesterdayWish * -100)
            }
        }

        const calculatepercentCustomToday = () => {
            if (yesterdayCustom === todayCustoms) {
                setPercentCustomToday(0)
            } else if (yesterdayInvite !== 0 && todayCustoms !== 0) {
                const change1 = (((todayCustoms - yesterdayCustom) / yesterdayCustom) * 100).toFixed(1);
                setPercentCustomToday(change1)
            } else if (yesterdayCustom === 0) {
                setPercentCustomToday(todayCustoms * -100)
            } else if (todayCustoms === 0) {
                setPercentCustomToday(yesterdayCustom * -100)
            }
        }

        calculatepercentInviteToday();
        calculatepercentWishToday();
        calculatepercentCustomToday();

    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: theme.backgroundColor }} >
            <View style={styles.header}>
                <AntDesign name='arrowleft' size={25} color={theme.textColor} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 20, color: theme.textColor, fontWeight: 'bold', marginLeft: 20 }}>Requests</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 15 }}>
                <View style={{ width: '70%', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#7f7f7f' }}>Invite Requests</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {selectedOption1 == 'Today' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{todayInvites}</Text>
                            }
                            {selectedOption1 == 'Last 7 days' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{last7daysInvites}</Text>
                            }
                            {selectedOption1 == 'Last 30 days' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{last30daysInvites}</Text>
                            }
                            <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                {percentInviteToday > 0 ? (
                                    <Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                        <Text style={{ fontSize: 16 }}>↑</Text>{Math.abs(percentInviteToday)}%
                                    </Text>
                                ) : (
                                    <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                        <Text style={{ fontSize: 16 }}>↓</Text>{Math.abs(percentInviteToday)}%
                                    </Text>
                                )}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', marginTop: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#7f7f7f' }}>Wish Requests</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {selectedOption1 == 'Today' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{todayWishes}</Text>
                            }
                            {selectedOption1 == 'Last 7 days' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{last7daysWishes}</Text>
                            }
                            {selectedOption1 == 'Last 30 days' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{last30daysWishes}</Text>
                            }
                            {percentWishToday > 0 ? (
                                <Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 16 }}>↑</Text>{Math.abs(percentWishToday)}%
                                </Text>
                            ) : (
                                <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 16 }}>↓</Text>{Math.abs(percentWishToday)}%
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', marginTop: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#7f7f7f' }}>Custom Requests</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {selectedOption1 == 'Today' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{todayCustoms}</Text>
                            }
                            {selectedOption1 == 'Last 7 days' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{last7daysCustoms}</Text>
                            }
                            {selectedOption1 == 'Last 30 days' &&
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>{last30daysCustoms}</Text>
                            }
                            {percentCustomToday > 0 ? (
                                <Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 16 }}>↑</Text>{Math.abs(percentCustomToday)}%
                                </Text>
                            ) : (
                                <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 16 }}>↓</Text>{Math.abs(percentCustomToday)}%
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
                <View style={{ width: '30%' }}>
                    <TouchableOpacity onPress={toggleDropdown1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.textColor, marginRight: 5 }}>{selectedOption1}</Text>
                        <AntDesign name='caretdown' size={10} color={theme.textColor} />
                    </TouchableOpacity>
                    {/* Dropdown Modal */}
                    <Modal
                        visible={showDropdown1}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setShowDropdown1(false)}
                    >
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
                            onPress={() => setShowDropdown1(false)}
                        >
                            <View style={{ backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
                                {options1.map(option => (
                                    <TouchableOpacity key={option} onPress={() => handleOptionSelect1(option)}>
                                        <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', paddingVertical: 5 }}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>
            <View style={{ marginHorizontal: 15, marginTop: 25, backgroundColor: '#e6f2ff', paddingVertical: 15, paddingLeft: 15, elevation: 1, borderRadius: 15 }}>
                <Text style={{ fontSize: 20, color: '#7f7f7f', fontWeight: 'bold' }}>Ongoing Requests</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', color: theme.textColor, marginTop: 10 }}>Expiring today</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', color: theme.textColor, marginTop: 10 }}>Expiring tomorrow</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', color: theme.textColor, marginTop: 10 }}>Delivered so far</Text>
            </View>
            <View style={{ paddingHorizontal: 20, flexDirection: 'row', marginTop: 25, justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => setActiveTab('Invite')} style={[{ width: '25%', justifyContent: 'center', alignItems: 'center', height: 30 }, activeTab === 'Invite' ? styles.activeTab : {}]}>
                        <Text style={[styles.tabText, activeTab !== 'Invite' ? { color: '#7f7f7f' } : {}]}>Invite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('Wish')} style={[{ width: '25%', justifyContent: 'center', alignItems: 'center', height: 30 }, activeTab === 'Wish' ? styles.activeTab : {}]}>
                        <Text style={[styles.tabText, activeTab !== 'Wish' ? { color: '#7f7f7f' } : {}]}>Wish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('Custom')} style={[{ width: '25%', justifyContent: 'center', alignItems: 'center', height: 30, }, activeTab === 'Custom' ? styles.activeTab : {}]}>
                        <Text style={[styles.tabText, activeTab !== 'Custom' ? { color: '#7f7f7f' } : {}]}>Custom</Text>
                    </TouchableOpacity>
                    <Animated.View style={[styles.tabSlider, { left: slidePosition, backgroundColor: theme.textColor }]} />
                </View>
                <TouchableOpacity onPress={toggleModal}>
                    <FontAwesome name='sliders' size={20} color={theme.textColor} />
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={toggleModal}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#f5f5f0', height: 200, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingVertical: 20, paddingHorizontal: 20, elevation: 5 }}>
                            <TouchableOpacity onPress={toggleModal}>
                                <AntDesign name='closecircle' size={22} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRequestTime('Today')} style={{ alignSelf: 'center' }}>
                                <Text style={[styles.modalOption, requestTime === 'Today' && styles.selectedOption]}>Today</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRequestTime('Yesterday')} style={{ alignSelf: 'center' }}>
                                <Text style={[styles.modalOption, requestTime === 'Yesterday' && styles.selectedOption]}>Yesterday</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRequestTime('Last 7 days')} style={{ alignSelf: 'center' }}>
                                <Text style={[styles.modalOption, requestTime === 'Last 7 days' && styles.selectedOption]}>Last 7 days</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            {activeTab === 'Invite' && requestTime === '' && (
                <FlatList
                    data={inviteRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Wish' && requestTime === '' && (
                <FlatList
                    data={wishRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Custom' && requestTime === '' && (
                <FlatList
                    data={customRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Invite' && requestTime === 'Today' && (
                <FlatList
                    data={inviteTodayRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Wish' && requestTime === 'Today' && (
                <FlatList
                    data={wishTodayRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Custom' && requestTime === 'Today' && (
                <FlatList
                    data={customTodayRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Invite' && requestTime === 'Yesterday' && (
                <FlatList
                    data={inviteYesterdayRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Wish' && requestTime === 'Yesterday' && (
                <FlatList
                    data={wishYesterdayRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Custom' && requestTime === 'Yesterday' && (
                <FlatList
                    data={customYesterdayRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Invite' && requestTime === 'Last 7 days' && (
                <FlatList
                    data={inviteLast7Requests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Wish' && requestTime === 'Last 7 days' && (
                <FlatList
                    data={wishLast7Requests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
            {activeTab === 'Custom' && requestTime === 'Last 7 days' && (
                <FlatList
                    data={customLast7Requests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRequestItem}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    tabButton: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        height: 30
    },
    activeTab: {
        // Change this color as needed
        backgroundColor: '#e6e6e6'
    },
    tabText: {
        color: 'black',
        fontSize: 16 // Change this color as needed
    },
    selectedOption: {
        backgroundColor: 'blue',
        color: 'white',
        width: 200,
        textAlign: 'center'
    },
    tabSlider: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '25%',
        height: 2,
    },
    modalSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        elevation: 5, // Add elevation for shadow (Android)
    },
    modalOption: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
        color: 'black',
        marginRight: 10
    },
})