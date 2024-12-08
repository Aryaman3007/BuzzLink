import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Modal,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import StarsScreen from './StarsScreen';
import TweetCard from '../TweetScreen/TweetCard';
import TweetMessage from '../TweetScreen/TweetMessage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ConnectScreen from '../ConnectScreen/ConnectScreen';
import { Colors } from '../../Styles';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import FeedLoadingScreen from './FeedLoadingScreen';
import { AuthContext } from '../../context/AuthProvider';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const HubRoute = ({ navigation, theme }) => {
  const [tweets, setTweets] = useState([]);
  const [pageLimit, setPageLimit] = useState(30);
  const [retry, setRetry] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState([])
  const { user } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchTweets();
  }, [retry]);

  const fetchBlockedUsers = async () => {
    const blockDoc = await firestore().collection('users').where('userId', '==', user.uid).get();
    const blockData = blockDoc.docs[0]?.data();

    if (blockData && blockData.blockedUsers) {
      const blockedUserIds = blockData.blockedUsers.map(user => user.userId);
      console.log('Blocked User IDs:', blockedUserIds);
      setBlockedUsers(blockData.blockedUsersIds);
    } else {
      setBlockedUsers([]);
    }
  }

  // useEffect(() => {
  //   fetchBlockedUsers();
  // }, [user])

  const fetchTweets = () => {
    try {
      const unsubscribe = firestore()
        .collection('Topics')
        .orderBy('createdAt', 'desc')
        // .where('userId', 'not-in', ['blockedUsers'])
        .onSnapshot(snapshot => {
          const fetchedTweets = snapshot?.docs?.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTweets(fetchedTweets);
          setIsLoading(false);
        });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching tweets: ', error);
      if (retry < 3) {
        setRetry(prev => prev + 1);
      } else {
        // show error screen
        // report to us silently
      }
      setIsLoading(false);
    }
  };
  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="white"
      style={styles.loadingOverlay}
    />
  ) : (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tweets.map(tweet => (
          <TweetMessage key={tweet.id} tweet={tweet} />
        ))}
      </ScrollView>
    </View>
  );
};

const RandomRoute = ({ navigation, theme }) => (
  <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
    <ConnectScreen navigation={navigation} />
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
  const [pageLimit, setPageLimit] = useState(30);

  const handleIndexChange = index => setIndex(index);

  const renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const tabWidth =
      Dimensions.get('window').width / props.navigationState.routes.length;

    return (
      <View
        style={[
          styles.mainContainer,
          { backgroundColor: theme.backgroundColor },
        ]}>
        <View style={[styles.tabBar, { backgroundColor: theme.backgroundColor }]}>
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i ? 1 : 0.5,
              ),
            });

            const textColor =
              index === i ? theme.textColor : Colors.tabTitleOff;
            const underlineColor =
              index === i ? Colors.profileBtn2 : Colors.tabTitleOff;
            const tabItemBackgroundColor =
              theme.backgroundColor === '#fff'
                ? Colors.tabIconDark
                : theme.bgColor;

            return (
              <React.Fragment key={i}>
                <TouchableOpacity
                  style={[
                    styles.tabItem,
                    { backgroundColor: tabItemBackgroundColor },
                  ]}
                  onPress={() => setIndex(i)}>
                  <Animated.Text
                    style={[{ opacity }, styles.tabText, { color: textColor }]}>
                    {route.title}
                  </Animated.Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabWidth,
                transform: [
                  { translateX: Animated.multiply(props.position, tabWidth) },
                ],
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const handleTweetNavigation = () => {
    navigation.navigate('TweetCard');
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <HubRoute navigation={navigation} theme={theme} />
        );
      case 'second':
        return <RandomRoute navigation={navigation} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <TabView
        navigationState={{
          index,
          routes: [
            { key: 'first', title: 'Hub' },
            { key: 'second', title: 'Random' },
          ],
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleTweetNavigation}>
        <Icon name="pencil" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.tabIconDark,
  },
  tabText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginStart: -10,
    marginTop: 3,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tabIndicator: {
    position: 'absolute',
    height: 3,
    backgroundColor: 'red',
    bottom: 0,
  },
  scroll: {
    marginBottom: 50,
    padding: 5,
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.sheetBack,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginBottom: 60,
    borderWidth: 1,
    borderColor: 'gray',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
