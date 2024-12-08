import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Colors, Fonts } from '../../Styles'
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { FirebaseLink } from '../../enum/FirebaseLink';
import { useNavigation } from '@react-navigation/native';
import DropdownPicker from 'react-native-dropdown-picker';
import { ThemeContext } from '../../context/ThemeContext';
import Toast from 'react-native-toast-message';
import FullScreenImageModal from './FullScreenImageModal';
import TweetDropdownMenu from './TweetDropdownMenu';
import messaging from '@react-native-firebase/messaging';
import { AuthContext } from '../../context/AuthProvider';

const TweetMessage: React.FC = ({ tweet }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeAnimation] = useState(new Animated.Value(1));
    const [likeCount, setLikeCount] = useState(tweet.likeCount || 0);
    const currentUserID = auth().currentUser ? auth().currentUser.uid : null;
    const [username, setUsername] = useState("");
    const [timeElapsed, setTimeElapsed] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [topicOwner, setTopicOwner] = useState("");
    const [notificationExists, setNotificationExists] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleRealtimeCall = async (userId: string, tweetId: string) => {
        try {
            const timestamp = Date.now();

            console.log(`Attempting to share tweet in Realtime Database. Data:`, { userId, timestamp });

            const shareData = {
                [userId]: {
                    userId: userId,
                    timestamp: timestamp
                }
            };

            const existingShareRef = database().ref(`Topics/${tweetId}/InterestedUsers`);
            existingShareRef.once('value', (snapshot) => {
                let likes = snapshot.val() || {};

                if (likes[userId]) {
                    console.log('Tweet already Interested in Realtime Database by this user');
                    return;
                }

                likes = { ...likes, ...shareData };

                existingShareRef.set(likes, (error) => {
                    if (error) {
                        console.error('Error writing data to Realtime Database:', error);
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'There was a problem liking the tweet in Realtime Database.'
                        });
                    } else {
                        console.log('Tweet Interested successfully in Realtime Database');
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Interested saved successfully!'
                        });
                    }
                });
            });
        } catch (err) {
            console.error('Error in handleRealtimeCall:', err);
        }
    };

    const getFCMToken = async () => {
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);

        return fcmToken;
    };

    const handleCall = async (userId, tweetId) => {
        try {
            handleRealtimeCall(userId, tweetId);

            handleFirestoreCall(userId, tweetId);
            setNotificationExists(true);

        } catch (err) {
            console.error('Error in handleCall:', err);
        }
    };

    const handleFirestoreCall = async (userId, tweetId) => {
        try {
            const tweetSnapshot = await firestore()
                .collection('Topics')
                .doc(tweetId)
                .get();

            if (tweetSnapshot.exists) {
                const tweetData = tweetSnapshot.data();
                console.log('User ID in Topics collection:', tweetData.userId);
                const targetUserId = tweetData.userId;

                const notificationRef = firestore()
                    .collection('notifications')
                    .where('actorId', '==', userId)
                    .where('tweetId', '==', tweetId);

                console.log(tweetId);

                const notificationSnapshot = await notificationRef.get();

                if (notificationSnapshot.empty) {
                    try {
                        const fcmToken = await getFCMToken();

                        await FirebaseLink(targetUserId, 'You have a new call!', 'call', userId, tweetId, fcmToken);

                    } catch (error) {
                        console.error('Error fetching target user data:', error);
                    }
                } else {
                    Toast.show({
                        type: 'info',
                        text1: 'Info',
                        text2: 'You have already made a request for this tweet.',
                    });
                    console.log("You have already made a request for this tweet")
                }
            } else {
                console.error('Tweet not found in Firestore');
            }
        } catch (error) {
            console.error('Error fetching tweet data from Firestore:', error);
        }
    };

    useEffect(() => {
        const fetchNotificationStatus = async () => {
            try {
                // Fetch notification status for the tweet
                const notificationRef = firestore()
                    .collection('notifications')
                    .where('actorId', '==', currentUserID)
                    .where('tweetId', '==', tweet.id);

                const notificationSnapshot = await notificationRef.get();

                // Set notificationExists state based on whether the notification exists or not
                if (!notificationSnapshot.empty) {
                    setNotificationExists(true);
                }
            } catch (error) {
                console.error('Error fetching notification status:', error);
            }
        };

        fetchNotificationStatus(); // Call the function to fetch notification status
    }, [currentUserID, tweet.id]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);

    const lightTheme = {
        backgroundColor: Colors.light,
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
        timeAgo: 'rgba(0,0,0,0.5)'
    };

    const darkTheme = {
        backgroundColor: Colors.profileBlack,
        textColor: Colors.light,
        iconColor: '#666',
        timeAgo: Colors.timeAgo
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const formatElapsedTime = (elapsedTimeInSeconds) => {
        const absoluteTime = Math.abs(elapsedTimeInSeconds);

        const secondsInMinute = 60;
        const secondsInHour = secondsInMinute * 60;
        const secondsInDay = secondsInHour * 24;
        const secondsInMonth = secondsInDay * 30;
        const secondsInYear = secondsInDay * 365;

        let timeElapsedText = '';

        if (absoluteTime >= secondsInYear) {
            const years = Math.floor(absoluteTime / secondsInYear);
            timeElapsedText = `${years} ${years > 1 ? 'years' : 'year'} ago`;
        } else if (absoluteTime >= secondsInMonth) {
            const months = Math.floor(absoluteTime / secondsInMonth);
            timeElapsedText = `${months} ${months > 1 ? 'months' : 'month'} ago`;
        } else if (absoluteTime >= secondsInDay) {
            const days = Math.floor(absoluteTime / secondsInDay);
            timeElapsedText = `${days} ${days > 1 ? 'days' : 'day'} ago`;
        } else if (absoluteTime >= secondsInHour) {
            const hours = Math.floor(absoluteTime / secondsInHour);
            timeElapsedText = `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
        } else if (absoluteTime >= secondsInMinute) {
            const minutes = Math.floor(absoluteTime / secondsInMinute);
            timeElapsedText = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
        } else {
            timeElapsedText = `${absoluteTime} ${absoluteTime === 1 ? 'second' : 'seconds'} ago`;
        }

        if (elapsedTimeInSeconds < 0) {
            timeElapsedText = `in ${timeElapsedText}`;
        }

        return timeElapsedText;
    };

    const renderTweetTextWithHashTags = (tweetText) => {
        const regex = /#[^\s#]+/g;
        const parts = tweetText.split(regex);
        const matches = tweetText.match(regex);
        return parts.map((part, index) => {
            if (matches && matches[index]) {
                return (
                    <Text key={index} style={{color: theme.textColor}}>
                        {part}
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>{matches[index]}</Text>
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    useEffect(() => {
        setIsLiked(tweet.likeUsers?.includes(currentUserID) || false);

        if (tweet.createdAt) {
            const creationTime = tweet.createdAt.toDate();
            const currentTime = new Date();
            const elapsedTimeInSeconds = Math.floor((currentTime - creationTime) / 1000);
            setTimeElapsed(formatElapsedTime(elapsedTimeInSeconds));
        }
    }, [tweet])



    /* const handleLike = async () => {
         try {
             const docRef = firestore().collection('TopicLikes').find({});
             const docSnapshot = await docRef.get();

             if (docSnapshot.exists) {
                 console.log('UNFOLLOWED')
                 await docRef.delete();
             } else {
                 console.log('FOLLOWED')
                 await docRef.set({
                     topicId: route.params.data.userId,
                     likedBy: currentUser.userId,
                     topicOwner: tweet.userId,
                     createdAt: firestore.FieldValue.serverTimestamp()
                 });
             }
         } catch (error) {
             console.error('Error following user:', error);
         }
    }*/

    const handleLike = async () => {
        const newLikeStatus = !isLiked;
        const newLikeCount = newLikeStatus ? likeCount + 1 : likeCount - 1;

        setIsLiked(newLikeStatus);
        setLikeCount(newLikeCount);

        let updatedLikeUsers;

        if (newLikeStatus) {
            updatedLikeUsers = firestore.FieldValue.arrayUnion(currentUserID);
        } else {
            updatedLikeUsers = firestore.FieldValue.arrayRemove(currentUserID);
        }

        try {
            await firestore().collection('Topics').doc(tweet.id).update({
                likeUsers: updatedLikeUsers,
                likeCount: newLikeCount
            });
        } catch (error) {
            console.error('Error updating likes:', error);
        }
        Animated.spring(likeAnimation, {
            toValue: newLikeStatus ? 1.2 : 1,
            friction: 3,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(likeAnimation, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
            }).start();
        });
    };

    const heartScale = likeAnimation;

    const heartStyle = {
        transform: [{ scale: heartScale }],
    };

    const handleShare = () => {
        console.log("Share button clicked");
        if (currentUserID && tweet.id) {
            console.log(`Sharing tweet with ID ${tweet.id} by user ${currentUserID}`);
            handleCall(currentUserID, tweet.id);
        } else {
            console.error("Invalid userID or tweetID", { currentUserID, tweetId: tweet.id });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
            <View style={styles.container}>
                <View style={styles.container1}>
                    <View style={styles.container11}>
                        <Image style={styles.profileImage} source={require('../../assets/avatar1.png')} />
                        <View style={styles.container12}>
                            <Text style={[styles.name, { color: theme.textColor }]}>{tweet.userName}</Text>
                            <Text style={[styles.time, { color: theme.timeAgo }]}>{timeElapsed}</Text>
                            {tweet.imageDownloadUrl && <TouchableOpacity onPress={toggleModal}>
                                <Image
                                    style={styles.tweetImage}
                                    source={{ uri: tweet.imageDownloadUrl }}
                                />
                            </TouchableOpacity>}
                            <FullScreenImageModal
                                visible={isModalVisible}
                                imageUri={tweet.imageDownloadUrl}
                                onClose={toggleModal}
                            />
                            <Text style={[styles.tweet, { color: theme.textColor }]}>
                                {renderTweetTextWithHashTags(tweet.topicText)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container21}>
                        <TweetDropdownMenu onClose={toggleDropdown} topicId={tweet.id} topicOwner={tweet.userId} isOpen={isDropdownOpen} />
                    </View>
                </View>

                <View style={styles.container4}>
                    <View style={styles.container41}>
                        <TouchableOpacity onPress={handleLike}>
                            <Animated.View style={heartStyle}>
                                <FontAwesome
                                    name={isLiked ? 'heart' : 'heart-o'}
                                    size={24}
                                    color={isLiked ? 'red' : Colors.timeAgo}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginLeft: 5, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.count, { color: theme.textColor }]}>{likeCount} </Text>
                            {/* <Text style={{color:'gray', fontSize:12}}>likes </Text> */}

                        </View>
                    </View>
                    <View style={styles.container42}>
                        <TouchableOpacity onPress={handleShare}>
                            <View style={styles.phoneIconCircle}>
                                {notificationExists ? (
                                    <Image source={require('../../assets/callBan.png')} style={styles.shareIcon} />
                                ) : (
                                    <SimpleLineIcons name='call-in' size={22} color={theme.textColor} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: "100%", borderWidth: 0.2, backgroundColor: 'gray', borderColor: 'gray', marginTop: 20 }}></View>

            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'transparent',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: 0,
    },
    dropdownButton: {
        position: 'absolute',
        top: 0,
        right: 10,
        zIndex: 2,
    },
    container1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container2: {
        paddingVertical: 8,
        // margin: 5
    },
    container3: {
        paddingHorizontal: 0,
        width: '100%',
    },
    container4: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        // borderWidth:1
        margin: 5,
        marginTop: 30
    },
    container11: {
        flexDirection: 'row',
    },
    container12: {
        flexDirection: 'column',
        padding: 9,
        marginStart: 3,
        width: 226,
    },
    container21: {
        flexDirection: 'column',
    },
    container41: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 9,
    },
    container42: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 9,
        marginStart: 10,
    },
    profileImage: {
        width: 72,
        height: 72,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 7,
    },
    tweetImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    time: {
        fontSize: 12,
        marginBottom: 5,
    },
    tweet: {
        fontSize: 14,
        fontWeight: '200',
        fontFamily: Fonts.regular
    },
    count: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    phoneIconCircle: {
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareIcon: {
        height: 28,
        width: 28,
    },
    heartIcon: {
        width: 24,
        height: 24,
    },
});

export default TweetMessage;