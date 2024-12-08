import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Image
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import TopicsScreen from './TopicsScreen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import database from '@react-native-firebase/database';
import WaitingCalls from './WaitingCalls';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';
import { Colors } from '../../Styles';
import { useCurrentUser } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthProvider';
import StarsScreen from './StarsScreen';
import StarsWaitingDetails from '../../components/StarsWaitingDetails';
import WaitingDetails from '../../components/WaitingDetails'
import { BottomSheet } from 'react-native-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';

const YourTopics = () => {
    const currentUser = useCurrentUser();
    const { user } = useContext(AuthContext);
    const [waitingUsers, setWaitingUsers] = useState([])
    const [display, setDisplay] = useState(false)
    const [selectedUsername, setSelectedUsername] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const bottomSheet = useRef(null);
    const [rating, setRating] = useState(0);
    const [selectedStarCount, setSelectedStarCount] = useState(0);
    const [selectedDollar, setSelectedDollar] = useState(null);

    const [topics, setTopics] = useState([]);
    const [index, setIndex] = useState(0);
    const [waitingList, setWaitingList] = useState([]);
    const [routes] = useState([
        { key: 'first', title: 'Calls' },
        { key: 'second', title: 'Your Topics' },
        { key: 'third', title: 'Stars' },
    ]);

    const { isDarkMode } = useContext(ThemeContext);

    const lightTheme = {
        backgroundColor: Colors.light,
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
    };

    const darkTheme = {
        backgroundColor: Colors.profileBlack,
        textColor: Colors.light,
        iconColor: '#666',
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const navigation = useNavigation()

    const handleDollarPress = (dollar) => {
        if (selectedDollar === dollar) {
            setSelectedDollar(null);
        } else {
            setSelectedDollar(dollar);
        }
    };

    const [isInputVisible, setInputVisible] = useState<boolean>(false);
    const [customAmount, setCustomAmount] = useState<string>('');

    const toggleInputVisibility = () => {
        setInputVisible(!isInputVisible);
    };


    const openBottomSheet = () => {
        setBottomSheetVisible(true);
    };

    // Function to close the bottom sheet
    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    const fetchTopics = async () => {
        try {
            if (user) {
                const topicsSnapshot = await firestore()
                    .collection('Topics')
                    .where('userId', '==', user.uid)
                    .get();

                const userTopics = topicsSnapshot.docs.map(async (doc) => {
                    const topicData = doc.data();
                    const topicId = doc.id;
                    const interestedUsersSnapshot = await database()
                        .ref(`/Topics/${topicId}/InterestedUsers`)
                        .once('value');

                    const interestedUsersCount = interestedUsersSnapshot.numChildren();
                    return { ...topicData, id: topicId, interestedUsersCount };
                });

                Promise.all(userTopics).then((topicsWithCount) => {
                    setTopics(topicsWithCount);
                });
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };


    useEffect(() => {
        fetchTopics();
    }, [user]);


    useEffect(() => {
        const getUserWaitingList = async () => {
            try {
                const waitingListRef = firestore()
                    .collection('user_Data')
                    .doc(user.uid)
                    .collection('callRequests');

                const unsubscribe = waitingListRef.onSnapshot((snapshot) => {
                    const updatedWaitingList = [];
                    snapshot?.forEach((doc) => {
                        updatedWaitingList?.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    setWaitingList(updatedWaitingList);
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error retrieving userWaitingList:', error);
            }
        };

        const unsubscribe = getUserWaitingList();

        // return () => {
        //     if (unsubscribe) {
        //         unsubscribe();
        //     }
        // };
    }, [user]);


    const handleDeleteAll = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete all documents?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await firestore()
                                .collection('user_Data')
                                .doc(user.uid)
                                .collection('callRequests')
                                .get()
                                .then(querySnapshot => {
                                    querySnapshot.forEach(doc => {
                                        doc.ref.delete();
                                    });
                                    Alert.alert("Success", "All documents deleted successfully.");
                                    setWaitingList([]);
                                });

                        } catch (error) {
                            Alert.alert("Error", "Failed to delete documents.");
                        }
                    }
                }
            ]
        );
    };

    const handlePress = (username) => {
        setSelectedUsername(username);
        const selectedUser = waitingUsers.find((user) => user.username === username);
        setSelectedUserId(selectedUser.userId)
        setDisplay(true);
    };

    const handleContainerPress = () => {
        if (display) {
            setDisplay(!display)
        }
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('influencerCallRooms')
            .doc(user.uid)
            .collection('waitingCalls')
            .onSnapshot((snapshot) => {
                const updatedWaitingUsers = snapshot.docs.map((doc) => doc.data());
                setWaitingUsers(updatedWaitingUsers);
                setIsLoading(false);
            }, (error) => {
                console.error('Error fetching waiting users:', error);
                setIsLoading(false);
            });

        return () => {
            unsubscribe();
        };
    }, [user]);


    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const handlePickRandom = () => {
        if (waitingUsers.length == 0) {
            Alert.alert('No pending calls !')
        } else {
            const randomIndex = Math.floor(Math.random() * waitingUsers.length);
            const randomUsername = waitingUsers[randomIndex].username;
            setSelectedUsername(randomUsername);
            setDisplay(true);
        }
    };

    const handleRemoveUser = async () => {
        const userToRemove = waitingUsers.find((user) => user.username === selectedUsername);

        if (userToRemove) {
            const influencerRoomRef = firestore().collection('influencerCallRooms').doc(user.uid);
            await influencerRoomRef.collection('waitingCalls').doc(selectedUserId).delete();
            console.log('Document deleted successfully from waitingCalls collection.');

            const userDocRef = firestore().collection('user_Data').doc(selectedUserId);
            await userDocRef.collection('callRequests').doc(selectedUserId + user.uid).delete();
            console.log('Document deleted successfully.');

            setWaitingUsers((prevUsers) => prevUsers.filter((user) => user.username !== userToRemove.username));
            setDisplay(false);
        }
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

    const showBottomSheet = () => {
        bottomSheet.current?.show();
    }

    const FirstRoute = () => {
        // useEffect(() => {
        //     navigation.getParent()?.setOptions({
        //         tabBarStyle: {
        //             display: "none"
        //         }
        //     });
        //     return () => navigation.getParent()?.setOptions({
        //         tabBarStyle: undefined
        //     });
        // }, [navigation]);
        return (
            <View style={{ flex: 1 }}>

                <TouchableWithoutFeedback onPress={handleContainerPress}>
                    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                        {display && <WaitingDetails selectedUserId={selectedUserId} selectedUsername={selectedUsername} onRemove={handleRemoveUser} showBottomSheet={showBottomSheet} />}
                        <ScrollView>
                            {waitingUsers.length == 0 ? (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 180 }}>
                                    <Text style={{ color: theme.textColor, fontSize: 25, fontWeight: '500' }}>No Waiting Calls for now!</Text>
                                    <Image style={{ height: 250, width: 250, marginTop: 20 }} source={require('../../assets/emptyWaiting.jpg')} />
                                </View>
                            ) : (
                                <View style={[styles.containerMiddle, { backgroundColor: theme.backgroundColor }]}>
                                    {waitingUsers.map((item, index) => (
                                        <TouchableOpacity key={index} style={[styles.waitingContainer, { backgroundColor: theme.backgroundColor }]} onPress={() => handlePress(item.username)}>
                                            <Image style={{ height: 110, width: 110, borderRadius: 55 }} source={require('../../assets/avatar.jpg')} />
                                            <Text style={{ color: theme.textColor }}>{item.username}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                        {waitingUsers.length > 6 && (
                            <View style={{ alignItems: 'center', paddingTop: 10 }}>
                                <TouchableOpacity style={styles.pickRandom} onPress={handlePickRandom}>
                                    <Text style={{ color: Colors.light, fontSize: 18, fontWeight: '600' }}>Pick Random</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity style={styles.bottomSheetButton} onPress={showBottomSheet}>
                            <Text style={styles.bottomSheetButtonText}>Open Bottom Sheet</Text>
                        </TouchableOpacity>

                        <BottomSheet
                            onBackButtonPress={closeBottomSheet}
                            onBackdropPress={closeBottomSheet}
                            ref={bottomSheet}
                            height={750}
                        >
                            <View style={[styles.containerr, { backgroundColor: theme.bottomSheetBack }]}>
                                <View style={styles.container1}>
                                    <Image style={styles.back} source={isDarkMode ? require('../../assets/back1.png') : require('../../assets/back.png')} />
                                    <Text style={[styles.rating, { color: isDarkMode ? 'white' : 'black' }]}>{selectedStarCount > 0 ? getRatingText(selectedStarCount) : "RATING!"}</Text>
                                    <Image style={styles.back1} source={isDarkMode ? require('../../assets/backWhite.png') : require('../../assets/bak.png')} />
                                </View>
                                <View style={styles.container2}>
                                    <Text style={styles.rateDes}>You rated username {selectedStarCount} stars</Text>
                                </View>
                                <View style={styles.container3}>
                                    {renderStars()}
                                </View>
                                <View style={styles.container4}>
                                    <TextInput
                                        style={styles.EditContainer}
                                        placeholder='Say something about Username service?'
                                        placeholderTextColor={'#009999'}
                                        textAlignVertical="top"
                                    />
                                </View>
                                <View style={styles.container5}>
                                    <Text style={[styles.tipText, { color: isDarkMode ? 'white' : 'black' }]}>Add a tip for Username</Text>
                                </View>
                                <View style={styles.container6}>
                                    <TouchableOpacity
                                        style={[styles.dollarBox, selectedDollar === 1 ? styles.selected : null]}
                                        onPress={() => handleDollarPress(1)}
                                    >
                                        <Text style={[styles.dollarText, { color: isDarkMode ? 'white' : 'black' }]}>US$1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.dollarBox, selectedDollar === 2 ? styles.selected : null]}
                                        onPress={() => handleDollarPress(2)}
                                    >
                                        <Text style={[styles.dollarText, { color: isDarkMode ? 'white' : 'black' }]}>US$2</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.dollarBox, selectedDollar === 3 ? styles.selected : null]}
                                        onPress={() => handleDollarPress(3)}
                                    >
                                        <Text style={[styles.dollarText, { color: isDarkMode ? 'white' : 'black' }]}>US$3</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.dollarBox, selectedDollar === 4 ? styles.selected : null]}
                                        onPress={() => handleDollarPress(4)}
                                    >
                                        <Text style={[styles.dollarText, { color: isDarkMode ? 'white' : 'black' }]}>US$5</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.container7}>
                                    {isInputVisible ? (
                                        <TouchableOpacity onPress={toggleInputVisibility}>
                                            <Text style={styles.customText}>Enter custom amount</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TextInput
                                                style={styles.customInput}
                                                value={customAmount}
                                                onChangeText={setCustomAmount}
                                                placeholder="Enter custom amount"
                                                placeholderTextColor="#80bfff"
                                                autoFocus
                                                onBlur={toggleInputVisibility}
                                            />
                                            <TouchableOpacity style={styles.cancelIcon} onPress={toggleInputVisibility}>
                                                <FontAwesome
                                                    name="times-circle"
                                                    size={24}
                                                    color="#80bfff"
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.container8}>
                                    <TouchableOpacity style={styles.touchButton}>
                                        <Text style={styles.submit}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </BottomSheet>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    const SecondRoute = () => (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor, marginTop: 10 }]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {topics.map((topic, index) => {
                    if (topic.interestedUsersCount >= 1) {
                        return (
                            <TopicsScreen
                                key={index}
                                tweet={topic.topicText}
                                interestedUsersCount={topic.interestedUsersCount}
                                postId={topic.id}
                            />
                        );
                    } else {
                        return null;
                    }
                })}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
    const ThirdRoute = () => (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor, marginTop: 10 }]}>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    {waitingList?.map((list, index) => (
                        <StarsWaitingDetails
                            key={index}
                            username={list.targetUserName}
                            targetUserId={list.targetUserId}
                        />
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
                {waitingList.length > 0 &&
                    <View style={{ marginBottom: 30, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.pickRandom} onPress={() => handleDeleteAll()}>
                            <Text style={{ color: Colors.light, fontSize: 18, fontWeight: '600' }}>Delete All</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.textColor }}
            style={{ backgroundColor: theme.backgroundColor }}
            labelStyle={{ color: theme.textColor }}
            renderLabel={({ route, focused, color }) => (
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ color: focused ? theme.textColor : Colors.tabTitleOff, fontWeight: '500' }}>{route.title}</Text>
                </View>
            )}
            pressOpacity={0}
        />
    );

    return (
        <View style={[styles.conatinerScreen, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header}>
                <AntDesign name='arrowleft' size={25} color={theme.textColor} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 18, color: theme.textColor, fontWeight: 'bold' }}>Your Activity</Text>
                <View></View>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                style={{ backgroundColor: theme.backgroundColor }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerMiddle: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10
    },
    waitingContainer: {
        padding: 10,
        alignItems: 'center',
    },
    pickRandom: {
        backgroundColor: Colors.primary,
        height: 45,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    bottomSheetButton: {
        backgroundColor: Colors.primary,
        height: 45,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    bottomSheetButtonText: {
        color: Colors.light,
        fontSize: 18,
        fontWeight: '600',
    },
    containerr: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    container1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
    },
    back1: {
        height: 30,
        width: 30,
    },
    back: {
        height: 60,
        width: 60,
    },
    rating: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    rateDes: {
        color: '#4F7396',
        fontSize: 18,
        fontWeight: 'bold',
    },
    container3: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    star: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
    },
    container4: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    EditContainer: {
        backgroundColor: '#ccffff',
        height: 120,
        width: 380,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        padding: 20,
        fontSize: 16,
    },
    container5: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
    },
    tipText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    container6: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 50,
    },
    dollarBox: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selected: {
        borderColor: 'blue',
    },
    dollarText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    container7: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    customText: {
        color: '#80bfff',
        fontSize: 18,
    },
    customInput: {
        backgroundColor: '#ccffff',
        height: 50,
        width: 280,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    cancelIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container8: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
    },
    touchButton: {
        backgroundColor: '#80bfff',
        height: 70,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 7,
        borderRadius: 20,
    },
    submit: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold'
    },
    mainContainer: {
        flexDirection: 'column',
    },
    container: {
        flex: 1,
    },
    conatinerScreen: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.dark,
        paddingBottom: 15
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    coinText: {
        fontWeight: 'bold',
        fontSize: 16,
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center',
        color: 'white'
    },
    goldoutline: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gold',
        borderRadius: 5,
        marginEnd: 10,
        padding: 5,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: 25,
        backgroundColor: '#262626'
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    tabText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    scroll: {
        marginBottom: 10,
    },
    horizontalLine: {
        height: 3,
        width: '120%',
        marginTop: 15,
        color: Colors.horLine
    },
    scrollContent: {
        flexGrow: 1,
    },
    pickRandom: {
        backgroundColor: Colors.primary,
        height: 45,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});

export default YourTopics