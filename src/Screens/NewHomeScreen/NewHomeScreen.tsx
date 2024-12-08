import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Button,
  TextInput
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../context/AuthProvider';
import { Colors } from '../../Styles';
import TweetMessage from '../TweetScreen/TweetMessage';
import { ThemeContext } from '../../context/ThemeContext';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import { useCurrentUser } from '../../context/UserContext';
import CelebsCard from '../../components/CelebsCard';
import { useRoute } from '@react-navigation/native';
import { BottomSheet } from 'react-native-sheet';

const NewHomeScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
  const [coinCount, setCoinCount] = useState(null);
  const currentUser = useCurrentUser()
  const [modalVisible, setModalVisible] = useState(false);
  const [userDatalen, setUserDatalen] = useState(0)
  const [message, setMessage] = useState('');
  const { data } = useRoute().params || {}

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

  const [routes] = useState([
    { key: 'first', title: 'STARS', icon: <FontAwesome name='star' size={20} color={theme.textColor} /> },
    { key: 'second', title: 'LIVE FEED', icon: <Entypo name='rss' size={20} color={theme.textColor} /> },
    { key: 'third', title: 'CELEBS', icon: <MaterialCommunityIcons name='emoticon-cool-outline' size={20} color={theme.textColor} /> },
  ]);

  const [userData, setUserData] = useState([]);
  const [rating, setRating] = useState(0);
  const [selectedStarCount, setSelectedStarCount] = useState(0);
  const [selectedDollar, setSelectedDollar] = useState(null);
  const [isInputVisible, setInputVisible] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    if (data && currentUser?.userId == data.user_id) {
      toggleModal();
    }
  }, [data]);

  const onSubmitRating = async () => {
    try {
      const ratingData = {
        ratedBy: data.user_id,
        ratedTo: user.uid,
        rating: selectedStarCount,
        createdAt: new Date(),
        message: message,
      };
      toggleModal();

      await firestore().collection('ratings').add(ratingData);

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      const currentTotalRating = userData.totalRating || 0;
      const currentAverageRating = userData.averageRating || 0;

      const newTotalRating = currentTotalRating + 1;
      const newAverageRating = (currentAverageRating * currentTotalRating + selectedStarCount) / newTotalRating;

      await firestore().collection('users').doc(user.uid).update({
        totalRating: newTotalRating,
        averageRating: newAverageRating,
      });

      console.log('Rating added successfully!');
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  const resetStateVariables = () => {
    setMessage('');
    setRating(0);
    setSelectedStarCount(0);
    setShowModal(false);
    setInputVisible(false);
    setSelectedDollar(null)
  };

  const toggleModal = () => {
    if (showModal) {
      resetStateVariables();
    }
    setShowModal(!showModal);
    console.log(showModal)
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let tempData = [];
        const snapshot = await firestore()
          .collection('influencers')
          .where('userId', '!=', user.uid)
          .get();
        snapshot.docs.forEach(item => {
          tempData.push(item.data());
        });
        setUserData(tempData);
        setUserDatalen(tempData.length)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user])

  const fetchUserCoinValue = async () => {
    try {

      const userDoc = await firestore().collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const coinValue = userDoc.data().coin;
        setCoinCount(coinValue);
      }
    } catch (error) {
      console.error('Error fetching user coin value: ', error);
    }
  };

  const subscribeToCoinValueChanges = () => {
    const userDocRef = firestore().collection('users').doc(user.uid);

    const unsubscribe = userDocRef.onSnapshot((doc) => {
      const coinValue = doc.data()?.coin;
      setCoinCount(coinValue);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeCoinValue = subscribeToCoinValueChanges();
    fetchUserCoinValue();

    return () => {
      unsubscribeCoinValue();
    };
  }, []);


  const addInWaiting = async (currentUserId, targetUserId, targetUsername) => {
    try {

      await firestore()
        .collection('influencerCallRooms')
        .doc(targetUserId) // Assuming 'user.uid' is the ID of the influencerCallRooms document
        .set({}, { merge: true });

      await firestore()
        .collection('influencerCallRooms')
        .doc(targetUserId)
        .collection('waitingCalls')
        .doc(user.uid)
        .set({
          userId: user.uid,
          username: currentUser?.username,
          createdAt: new Date(),
        });


      const docRef = firestore().collection('user_Data').doc(user.uid).collection('callRequests').doc(user.uid + targetUserId);
      const querySnapshot = await docRef.get();
      if (!querySnapshot.exists) {
        await firestore().collection('user_Data').doc(user.uid).collection('callRequests').doc(user.uid + targetUserId).set({
          targetUserId: targetUserId,
          targetUserName: targetUsername,
          createdAt: new Date(),
          actorId: currentUserId,
        });
        Alert.alert('User added to WaitingCalls list')
      } else {
        Alert.alert('User already exists in WaitingCalls list')
      }
    } catch (error) {
      console.error("Error adding data to userWaitingList collection: ", error);
    }
  }

  const [tweets, setTweets] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([])

  const fetchTweets = async () => {
    try {
      // const blockDoc = await firestore().collection('users').where('userId', '==', user.uid).get();
      // const blockData = blockDoc.docs[0]?.data();

      // if (blockData && blockData.blockedUsers) {
      //   const blockedUserIds = blockData.blockedUsers.map(user => user.userId);
      //   console.log('Blocked User IDs:', blockedUserIds);
      //   setBlockedUsers(blockedUserIds);
      // } else {
      //   setBlockedUsers([]);
      // }
      const querySnapshot = await firestore()
        .collection('Topics')
        .orderBy('createdAt', 'desc')
        .get();

      const fetchedTweets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(fetchedTweets);
    } catch (error) {
      console.error('Error fetching tweets: ', error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user])

  const FirstRoute = React.memo(() => (
    <ScrollView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.cards}>
        {loading ? (
          <View style={{ flexDirection: 'row' }}>
            {[...Array(userDatalen)].map((_, index) => (
              <View key={index} style={{ flexDirection: 'column', alignItems: 'center' }}>
                <ShimmerPlaceholder
                  style={{
                    height: 150,
                    width: 110,
                    borderRadius: 12,
                    marginBottom: 5
                  }}
                  shimmerColors={['#564d4d', '#8e8e8e', '#564d4d']}
                />
                <ShimmerPlaceholder
                  style={{
                    height: 16,
                    width: 90,
                    borderRadius: 15,
                  }}
                  shimmerColors={['#564d4d', '#8e8e8e', '#564d4d']}
                />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollUsers}>
            {userData.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() =>
                  navigation.navigate('VisitProfile', { data: item })
                }
              >
                <View style={styles.boxUsers}>
                  <View style={{ height: 60, width: 110 }}>
                    <Image
                      source={require('../../assets/avatar.jpg')}
                      style={styles.avatarImg}
                    />
                    <View style={{ position: 'absolute', marginTop: 110, backgroundColor: '#666699', opacity: 0.8, height: 40, width: 110, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ fontWeight: 'bold', fontSize: 17, color: 'white', opacity: 1 }}
                      >
                        {item.username}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        )
        }
      </View>
      <View style={styles.offer}></View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={toggleModal}
      >
        <View style={[styles.containerr, { backgroundColor: theme.backgroundColor }]}>
          <View style={styles.container1}>
            <View></View>
            <Text style={[styles.rating, { color: isDarkMode ? 'white' : 'black' }]}>{selectedStarCount > 0 ? getRatingText(selectedStarCount) : "RATING!"}</Text>
            <TouchableOpacity onPress={toggleModal}>
              <AntDesign name='closecircle' size={22} />
            </TouchableOpacity>
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
              value={message}
              onChangeText={text => setMessage(text)}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styles.customInput}
                value={customAmount}
                onChangeText={text => setCustomAmount(text)}
                placeholder="Enter custom amount"
                placeholderTextColor="#80bfff"
                onBlur={toggleInputVisibility}
              />
            </View>
          </View>
          <View style={styles.container8}>
            <TouchableOpacity style={styles.touchButton} onPress={onSubmitRating}>
              <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.categories}>
        <View style={[styles.categoryBox, { backgroundColor: '#0080ff' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Womens Fashion</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Dresses, shoes & more</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#3d3d5c' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Electronics</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Latest gadgets</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#006666' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Home & Kitchen</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Decorate your home</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#2d8659' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Beauty & Health</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Skincare & makeup</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#e64d00' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Beauty & Health</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Skincare & makeup</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#999900' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Beauty & Health</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Skincare & makeup</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#ff1a75' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Beauty & Health</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Skincare & makeup</Text>
        </View>
        <View style={[styles.categoryBox, { backgroundColor: '#8c1aff' }]}>
          <Image source={require('../../assets/dummy.png')} style={styles.categoryImg} />
          <Text style={[styles.categoryTitle, { color: 'white' }]}>Beauty & Health</Text>
          <Text style={[styles.categoryDesc, { color: 'white' }]}>Skincare & makeup</Text>
        </View>
      </View>
    </ScrollView>
  )
  )

  const SecondRoute = () => (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.backgroundColor }]} showsVerticalScrollIndicator={false}>
        {tweets.map(tweet => (
          <TweetMessage key={tweet.id} tweet={tweet} />
        ))}
      </ScrollView>
    </View>
  )

  const ThirdRoute = () => (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor, paddingBottom: 70 }}>
      <View style={{ marginHorizontal: 20, marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 1.5, color: theme.textColor }}>Welcome!!!</Text>
        <View style={{ borderColor: theme.textColor, borderWidth: 1, height: 30, width: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome name='sliders' size={20} color={theme.textColor} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {userData.map((item, index) => (
          <TouchableOpacity key={index} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', marginVertical: 7, ...(index % 2 === 0 ? { paddingLeft: 10 } : { paddingRight: 10 }) }} onPress={() => navigation.navigate('Celebs', { data: item })}>
            <Image style={{ position: 'relative', height: 190, width: '90%', borderRadius: 20 }} source={require('../../assets/avatar.jpg')} />
            <View style={{ position: 'absolute', flexDirection: 'column', alignItems: 'center', top: 110, width: '90%', justifyContent: 'center', ...(index % 2 === 0 ? { paddingLeft: 10 } : { paddingRight: 10 }) }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{item.username}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', width: '90%' }}>
                <TouchableOpacity style={{ backgroundColor: '#ef8689', paddingHorizontal: 10, paddingVertical: 5 }} onPress={() => addInWaiting(user.uid, item.userId, item.username)}>
                  <Text style={{ color: 'white' }}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#6d8fea', paddingHorizontal: 10, paddingVertical: 5 }} onPress={() => navigation.navigate('ChatBot', { targetUserId: item.userId, targetUsername: item.username })}>
                  <Text style={{ color: 'white' }}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
          {React.cloneElement(route.icon, {
            color: focused ? theme.textColor : Colors.tabTitleOff // Change color based on focus
          })}
          <Text style={{ color: focused ? theme.textColor : Colors.tabTitleOff, fontWeight: '500' }}>{route.title}</Text>
        </View>
      )}
      pressOpacity={0}
    />
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Header theme={theme} coinCount={coinCount} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  coinCount: {
    minWidth: 55,
    maxWidth: 120,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderEndColor: 'gray',
    paddingHorizontal: 3,
    marginLeft: 15,
  },
  coinImg: {
    height: 30,
    width: 25,
  },
  cards: {
    marginTop: 20,
    height: 160
  },
  scrollUsers: {
    paddingHorizontal: 5
  },
  boxUsers: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 8,
    paddingTop: 0
  },
  avatarImg: {
    height: 150,
    width: 110,
    borderRadius: 12,
    marginBottom: 5,
    position: 'relative'
  },
  offer: {
    marginTop: 12,
    height: 70,
    backgroundColor: 'yellow',
    borderRadius: 12,
  },
  scroll: {
    marginTop: 20,
    marginBottom: 40,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 5,
    paddingBottom: 90
  },
  categoryBox: {
    width: 172,
    height: 152,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  categoryImg: {
    height: 40,
    width: 40,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4
  },
  categoryDesc: {
    fontSize: 14,
    fontWeight: '600'
  },
  modalView: {
    position: 'absolute',
    top: '20%',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 20,
    backgroundColor: '#3b90d1',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '55%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  containerr: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 100
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
});

export default NewHomeScreen