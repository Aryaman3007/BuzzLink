import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Animated, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { ThemeContext } from '../../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const { createAnimatedComponent } = Animated;
const AnimatedFlatList = createAnimatedComponent(FlatList);

const UserCard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          const user = userDoc.data();
          setUserData(user);
        } else {

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <Image style={styles.image} source={require('../../assets/avatar.jpg')} />
      <View style={[styles.cardContent, { backgroundColor: theme.cardContentBackground }]}>
        {userData ? (
          <Text style={[styles.cardText, { color: theme.textColor }]}>User ID: {userId}, Username: {userData.username}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

const InterestedUsersScreen = ({ route }) => {
  const { postId } = route.params;
  const [interestedUsers, setInterestedUsers] = useState([]);
  const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        const snapshot = await database().ref(`/Topics/${postId}/InterestedUsers`).once('value');
        const users = snapshot.val() || {};
        const userArray = Object.entries(users).map(([userId, userData]) => ({ userId, ...userData }));
        setInterestedUsers(userArray);
        console.log('Interested Users:', userArray);
      } catch (error) {
        console.error('Error fetching interested users:', error);
      }
    };

    fetchInterestedUsers();
  }, [postId]);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const renderUserCard = ({ item }) => (
    <UserCard userId={item.userId} username={item.username} />
  );

  const cardWidth = 300;
  const cardSpacing = 10;

  const totalCardWidth = cardWidth + cardSpacing;
  const horizontalPadding = (screenWidth - cardWidth) / 2 - cardSpacing / 0.7;

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <AnimatedFlatList
        data={interestedUsers}
        horizontal
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={totalCardWidth}
        decelerationRate="fast"
        keyExtractor={(item) => item.userId}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * 340,
            index * 340,
            (index + 1) * 340
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
              <UserCard userId={item.userId} />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const lightTheme = {
  backgroundColor: 'white',
  cardBackground: 'lightgray',
  cardContentBackground: '#ffffcc',
  textColor: 'black',
};

const darkTheme = {
  backgroundColor: 'black',
  cardBackground: '#333333',
  cardContentBackground: '#444444',
  textColor: 'white',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    borderRadius: 10,
    padding: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    height: 500,
    width: '100%',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InterestedUsersScreen;
