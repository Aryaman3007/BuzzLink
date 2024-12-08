import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Animated,
    PanResponder,
    Platform,
    TouchableOpacity,
    Alert,
    StatusBar,
    Image,
    ScrollView,
    Button, ActivityIndicator, TextInput
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../context/AuthProvider';
import { useCurrentUser } from '../../context/UserContext';
import { Colors, Fonts, GlobalStyles } from '../../Styles'
import { BottomSheet } from 'react-native-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign'
import firestore from '@react-native-firebase/firestore'
import { useNavigation, useRoute } from '@react-navigation/native';
import TweetMessage from '../TweetScreen/TweetMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const TabBarHeight = 48;
const HeaderHeight = 390;
const SafeStatusBar = Platform.select({
    ios: 44,
    android: StatusBar.currentHeight,
});
const tab1ItemSize = (windowWidth - 30) / 2;
const tab2ItemSize = (windowWidth - 40) / 3;

const VisitProfileScreen = () => {
    /**
     * stats
     */
    const [tabIndex, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'tab1', title: 'Your Topics' },
        { key: 'tab2', title: 'About' },
    ]);
    const [canScroll, setCanScroll] = useState(true);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [newAboutText, setNewAboutText] = useState('');
    const [oldAboutText, setOldAboutText] = useState('');
    const [aboutValue, setAboutValue] = useState("");
    const [isEditingDob, setIsEditingDob] = useState(false);
    const [dob, setDob] = useState(null)

    const handleCancelEditDob = () => {
        setIsEditingDob(false);
    };

    const handleEditAbout = () => {
        setOldAboutText(newAboutText);
        setIsEditingAbout(true);
    };

    // useEffect(() => {
    //   const fetchDob = async () => {
    //     try {
    //       if (!user) {
    //         console.error('User is undefined.');
    //         return;
    //       }

    //       const userDoc = await firestore().collection('users').doc(user.uid).get();
    //       const userData = userDoc.data();
    //       if (userData && userData.dob) {
    //         setDob(userData.dob);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching Date of Birth:', error);
    //     }
    //   };

    //   fetchDob();
    // }, [user]);


    const handleSaveDob = async () => {
        try {
            await firestore().collection('users').doc(user.uid).update({ dob });
            setIsEditingDob(false);
        } catch (error) {
            console.error('Error saving Date of Birth:', error);
        }
    };


    const handleSaveAbout = async () => {
        try {
            await firestore().collection('users').doc(user.uid).update({ about: newAboutText });
            setOldAboutText(newAboutText);
            setIsEditingAbout(false);

        } catch (error) {
            console.error('Error saving about text:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingAbout(false);
    };

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

    /**
     * ref
     */
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerScrollY = useRef(new Animated.Value(0)).current;
    const listRefArr = useRef([]);
    const listOffset = useRef({});
    const isListGliding = useRef(false);
    const headerScrollStart = useRef(0);
    const _tabIndex = useRef(0);
    const { user } = useContext(AuthContext)
    const currentUser = useCurrentUser()
    const [tweets, setTweets] = useState([]);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const bottomSheet = useRef(null);
    const [coinCount, setCoinCount] = useState(null);
    const [profileData, setProfileData] = useState(null)
    const [loadingTweets, setLoadingTweets] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [onFollowClick, setOnFollowClick] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigation = useNavigation();
    const route = useRoute()

    /**
     * PanResponder for header
     */
    const headerPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onStartShouldSetPanResponder: (evt, gestureState) => {
                headerScrollY.stopAnimation();
                syncScrollOffset();
                return false;
            },

            onMoveShouldSetPanResponder: (evt, gestureState) => {
                headerScrollY.stopAnimation();
                return Math.abs(gestureState.dy) > 5;
            },

            onPanResponderRelease: (evt, gestureState) => {
                syncScrollOffset();
                if (Math.abs(gestureState.vy) < 0.2) {
                    return;
                }
                headerScrollY.setValue(scrollY._value);
                Animated.decay(headerScrollY, {
                    velocity: -gestureState.vy,
                    useNativeDriver: true,
                }).start(() => {
                    syncScrollOffset();
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                listRefArr.current.forEach((item) => {
                    if (item.key !== routes[_tabIndex.current].key) {
                        return;
                    }
                    if (item.value) {
                        item.value.scrollToOffset({
                            offset: -gestureState.dy + headerScrollStart.current,
                            animated: false,
                        });
                    }
                });
            },
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                headerScrollStart.current = scrollY._value;
            },
        }),
    ).current;

    /**
     * PanResponder for list in tab scene
     */
    const listPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                headerScrollY.stopAnimation();
                return false;
            },
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                headerScrollY.stopAnimation();
            },
        }),
    ).current;


    /**
     * effect
     */
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const curRoute = routes[tabIndex].key;
            listOffset.current[curRoute] = value;
        });

        headerScrollY.addListener(({ value }) => {
            listRefArr.current.forEach((item) => {
                if (item.key !== routes[tabIndex].key) {
                    return;
                }
                if (value > HeaderHeight || value < 0) {
                    headerScrollY.stopAnimation();
                    syncScrollOffset();
                }
                if (item.value && value <= HeaderHeight) {
                    item.value.scrollToOffset({
                        offset: value,
                        animated: false,
                    });
                }
            });
        });
        return () => {
            scrollY.removeAllListeners();
            headerScrollY.removeAllListeners();
        };
    }, [routes, tabIndex]);

    /**
     *  helper functions
     */
    const syncScrollOffset = () => {
        const curRouteKey = routes[_tabIndex.current].key;

        listRefArr.current.forEach((item) => {
            if (item.key !== curRouteKey) {
                if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
                    if (item.value) {
                        item.value.scrollToOffset({
                            offset: scrollY._value,
                            animated: false,
                        });
                        listOffset.current[item.key] = scrollY._value;
                    }
                } else if (scrollY._value >= HeaderHeight) {
                    if (
                        listOffset.current[item.key] < HeaderHeight ||
                        listOffset.current[item.key] == null
                    ) {
                        if (item.value) {
                            item.value.scrollToOffset({
                                offset: HeaderHeight,
                                animated: false,
                            });
                            listOffset.current[item.key] = HeaderHeight;
                        }
                    }
                }
            }
        });
    };

    const onMomentumScrollBegin = () => {
        isListGliding.current = true;
    };

    const onMomentumScrollEnd = () => {
        isListGliding.current = false;
        syncScrollOffset();
    };

    const onScrollEndDrag = () => {
        syncScrollOffset();
    };

    useEffect(() => {
        const unsubscribeFollowers = firestore()
            .collection('profileData')
            .where('follower', '==', route.params.data?.userId)
            .onSnapshot(querySnapshot => {
                setFollowersCount(querySnapshot.size);
            });

        const unsubscribeFollowing = firestore()
            .collection('profileData')
            .where('following', '==', route.params.data?.userId)
            .onSnapshot(querySnapshot => {
                setFollowingCount(querySnapshot.size);
            });

        return () => {
            unsubscribeFollowers();
            unsubscribeFollowing();
        };

    }, []);

    const fetchTweets = async () => {
        try {
            setLoadingTweets(true);
            const querySnapshot = await firestore()
                .collection('Topics')
                .orderBy('createdAt', 'desc')
                .get();

            const fetchedTweets = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const filteredTweets = fetchedTweets.filter(tweet => tweet.userId === route.params.data?.userId);

            setTweets(filteredTweets);
            setLoadingTweets(false);
        } catch (error) {
            console.error('Error fetching tweets: ', error);
            setLoadingTweets(false);
        }
    };
    const [aboutPlaceholder, setAboutPlaceholder] = useState("Loading...");

    const toggleFollow = () => {
        setOnFollowClick(prevState => !prevState);
    };

    const IS_FOLLOWING_KEY = 'isFollowing';

    const updateIsFollowing = async (value) => {
        try {
            setIsFollowing(value);
            await AsyncStorage.setItem(IS_FOLLOWING_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error updating isFollowing status:', error);
        }
    };

    const checkIsFollowingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem(IS_FOLLOWING_KEY);
            if (value !== null) {
                setIsFollowing(JSON.parse(value));
            }
        } catch (error) {
            console.error('Error checking isFollowing status:', error);
        }
    };

    useEffect(() => {
        checkIsFollowingStatus();
        fetchTweets();
    }, []);

    const followUser = async () => {
        try {
            const docRef = firestore().collection('profileData').doc(currentUser.userId + route.params.data.userId);
            const docSnapshot = await docRef.get();

            if (docSnapshot.exists) {
                console.log('UNFOLLOWED')
                await docRef.delete();
            } else {
                console.log('FOLLOWED')
                await docRef.set({
                    follower: route.params.data.userId,
                    following: currentUser.userId,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    date: new Date().getDate(),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                });
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };


    useEffect(() => {
        const followersListener = firestore()
            .collection('profileData')
            .where('follower', '==', route.params.data.userId)
            .onSnapshot(querySnapshot => {
                setFollowersCount(querySnapshot.size);
            });

        const followingListener = firestore()
            .collection('profileData')
            .where('following', '==', route.params.data.userId)
            .onSnapshot(querySnapshot => {
                setFollowingCount(querySnapshot.size);
            });

        const followStatusListener = firestore()
            .collection('profileData')
            .doc(currentUser.userId + route.params.data.userId)
            .onSnapshot(docSnapshot => {
                setIsFollowing(docSnapshot.exists);
            });

        return () => {
            followersListener();
            followingListener();
            followStatusListener();
        };
    }, [route.params.data, currentUser]);

    /**
     * render Helper
     */
    const renderHeader = () => {
        const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [0, -HeaderHeight],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View
                {...headerPanResponder.panHandlers}
                style={[styles.animatedHeader, { transform: [{ translateY: y }] }]}>
                <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                    <View style={styles.header}>
                        <AntDesign name='arrowleft' size={25} color={theme.textColor} onPress={() => navigation.goBack()} />
                        <Text style={{ color: theme.textColor, fontSize: 18, fontWeight: '500', marginLeft: 10 }}>PROFILE</Text>
                    </View>
                    <View style={styles.profile}>
                        <View style={styles.profileContent}>
                            <Image style={styles.avatar} source={require('../../assets/avatar.jpg')} />
                            <Text style={{ fontSize: 22, color: theme.textColor, fontWeight: '600' }}>Aryaman Singh</Text>
                            <Text style={{ fontSize: 16, color: theme.textColor, fontWeight: '400', opacity: 0.6 }}>@{route.params.data?.username || 'Loading...'}</Text>
                            <View style={styles.profileOptions}>
                                <TouchableOpacity
                                    style={styles.buttonOptions1}
                                    onPress={() => {
                                        followUser()
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: Colors.profileBlack, fontWeight: '600' }}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonOptions2}>
                                    <Text style={{ fontSize: 15, color: Colors.light, fontWeight: '600' }}>Message</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileData}>
                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={[styles.dataBox, { borderColor: theme.textColor }]}>
                                        <Text style={{ fontSize: 24, color: theme.textColor, fontWeight: 'bold' }}>{followersCount !== null ? followersCount : 'Loading...'}</Text>
                                        <Text style={{ fontSize: 14, color: theme.textColor, opacity: 0.8 }}>Followers</Text>
                                    </View>
                                </View>
                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={[styles.dataBox, { borderColor: theme.textColor }]}>
                                        <Text style={{ fontSize: 24, color: theme.textColor, fontWeight: 'bold' }}>{followingCount !== null ? followingCount : 'Loading...'}</Text>
                                        <Text style={{ fontSize: 14, color: theme.textColor, opacity: 0.8 }}>Following</Text>
                                    </View>
                                </View>
                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={[styles.dataBox, { borderColor: theme.textColor }]}>
                                        <Text style={{ fontSize: 24, color: theme.textColor, fontWeight: 'bold' }}>1.9M</Text>
                                        <Text style={{ fontSize: 14, color: theme.textColor, opacity: 0.8 }}>Posts</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const FirstRoute = () => {
        return (
            <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {tweets.map(tweet => (
                        <TweetMessage key={tweet.id} tweet={tweet} />
                    ))}
                </ScrollView>
            </View>
        )
    };

    const SecondRoute = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.backgroundColor, flex: 1, marginBottom: 80 }}>
                <Text style={{ color: theme.textColor, fontSize: 22, fontWeight: 'bold', marginTop: 20, marginLeft: 15 }}>About Aryaman</Text>
                <Text style={{ color: theme.textColor, fontSize: 16, marginTop: 10, marginHorizontal: 15, lineHeight: 24 }}>
                    Daisy Willis is a fashion model and social media
                    influencer, known for her elegant style and
                    glamorous photos. She has appeared in various
                    fashion magazines and has a massive following
                    on Instagram.</Text>
                <View style={[styles.about1, { backgroundColor: theme.backgroundColor }]}>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14 }}>Birthday</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Jul 30, 2003</Text>
                    </View>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14 }}>Hometown</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Muzzaffarpur, Bihar</Text>
                    </View>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14 }}>Hobbies</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Photography, Travel</Text>
                    </View>
                </View>
                <Text style={{ color: theme.textColor, fontSize: 22, fontWeight: 'bold', marginTop: 15, marginLeft: 15 }}>Trivia</Text>
                <View style={[styles.about1, { backgroundColor: theme.backgroundColor }]}>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14, paddingRight: 30 }}>Favorite Color</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Green</Text>
                    </View>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14, paddingRight: 30 }}>Favorite Food</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Aloo Paratha</Text>
                    </View>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14, paddingRight: 30 }}>Favorite Icon</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Skrossi</Text>
                    </View>
                    <View style={[styles.about11, { backgroundColor: theme.backgroundColor, borderTopColor: '#E5E8EB' }]}>
                        <Text style={{ width: 110, color: theme.aboutText, fontSize: 14, paddingRight: 50 }}>Role Model</Text>
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>Mother</Text>
                    </View>
                </View>
            </ScrollView>
        );
    };

    const renderLabel = ({ route, focused }) => {
        return (
            <Text style={{ color: focused ? theme.textColor : Colors.tabTitleOff, fontWeight: '500' }}>{route.title}</Text>
        )
    }

    const renderScene = ({ route }) => {
        const focused = route.key === routes[tabIndex].key;
        let renderItem;
        let data;
        switch (route.key) {
            case 'tab1':
                data = [0];
                renderItem = FirstRoute;
                break;
            case 'tab2':
                data = [0];
                renderItem = SecondRoute;
                break;
            default:
                return null;
        }
        return (
            <Animated.FlatList
                // scrollEnabled={canScroll}
                {...listPanResponder.panHandlers}
                ref={(ref) => {
                    if (ref) {
                        const found = listRefArr.current.find((e) => e.key === route.key);
                        if (!found) {
                            listRefArr.current.push({
                                key: route.key,
                                value: ref,
                            });
                        }
                    }
                }
                }
                scrollEventThrottle={16}
                onScroll={
                    focused
                        ? Animated.event(
                            [
                                {
                                    nativeEvent: { contentOffset: { y: scrollY } },
                                },
                            ],
                            { useNativeDriver: true },
                        )
                        : null
                }
                onMomentumScrollBegin={onMomentumScrollBegin}
                onScrollEndDrag={onScrollEndDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                contentContainerStyle={{
                    paddingTop: HeaderHeight + TabBarHeight - 30,
                    paddingHorizontal: 10,
                    minHeight: windowHeight - SafeStatusBar + HeaderHeight,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                style={{ backgroundColor: theme.backgroundColor }}
                data={data}
            />
        );
    };

    const renderTabBar = (props) => {
        const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [HeaderHeight, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View
                style={{
                    top: 0,
                    zIndex: 1,
                    transform: [{ translateY: y }],
                }}>
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: theme.textColor }}
                    style={{ backgroundColor: theme.backgroundColor }}
                    labelStyle={{ color: theme.textColor }}
                    {...props}
                    renderLabel={renderLabel}
                    pressOpacity={0}
                />
            </Animated.View>
        );
    };

    const renderTabView = () => {
        return (
            <TabView
                onSwipeStart={() => setCanScroll(false)}
                onSwipeEnd={() => setCanScroll(true)}
                onIndexChange={(id) => {
                    _tabIndex.current = id;
                    setIndex(id);
                }}
                navigationState={{ index: tabIndex, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
            />
        );
    };

    return (
        <View style={styles.container}>
            {renderTabView()}
            {renderHeader()}
        </View>
    );
};

const styles = StyleSheet.create({
    animatedHeader: {
        height: HeaderHeight,
        width: '100%',
        position: 'absolute',
    },
    firstContainer: {

    },
    secondContainer: {

    },
    container: {
        flex: 1,
    },
    label: { fontSize: 16, color: '#222' },
    tab: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: '#FFCC80',
        height: TabBarHeight,
    },
    indicator: { backgroundColor: '#222' },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    headerLeft: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    coinCount: {
        borderWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 2,
        borderRadius: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinImg: {
        height: 25,
        width: 25,
    },
    menuBar: {
        marginLeft: 20,
        marginRight: 15
    },
    bottomSheetContainer: {
        flex: 1,
        paddingLeft: 30,
        borderRadius: 20,
    },
    bottomSheetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 17,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    bottomSheetIcon: {
        marginRight: 15,
        padding: 5,
        backgroundColor: '#2E2E2E',
        borderRadius: 8
    },
    bottomSheetText: {
        fontSize: 18,
        marginLeft: 5,
        fontFamily: Fonts.regular,
    },
    profile: {
        flex: 1,
        marginTop: 5
    },
    profileContent: {
        flexDirection: 'column',
        paddingHorizontal: 15,
    },
    avatar: {
        height: 110,
        width: 110,
        borderRadius: 55,
        marginBottom: 10
    },
    profileOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    buttonOptions1: {
        borderRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 10,
        backgroundColor: Colors.profileBtn1
    },
    buttonOptions2: {
        borderRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 10,
        backgroundColor: Colors.profileBtn2
    },
    profileData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    dataBox: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    scroll: {
        marginBottom: 40,
    },
    about1: {
        flexDirection: 'column',
        padding: 15,
        marginTop: 20
    },
    about11: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderTopWidth: 0.5
    },
    touchCoinCount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    aboutEdit: {
        fontSize: 16,
        marginTop: 10,
        marginHorizontal: 15,
        lineHeight: 24,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderWidth: 0.7,
    },
    verticalLine: {
        height: 24,
        width: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
});

export default VisitProfileScreen;

