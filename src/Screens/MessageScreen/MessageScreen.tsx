import { View, Text, StyleSheet, TextInput, Image, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MessageCard from '../../components/MessageCard'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../context/AuthProvider'
import { useCurrentUser } from '../../context/UserContext'
import { Colors } from '../../Styles'
import { ThemeContext } from '../../context/ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function MessageScreen() {

  const { user } = useContext(AuthContext)
  const [userData, setUserData] = useState([])
  const currentUser = useCurrentUser()
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const [coinCount, setCoinCount] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  const [blockedUsers, setBlockedUsers] = useState([])


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

  const fetchUserData = async () => {
    try {
      let tempData = [];
      const blockDoc = await firestore().collection('users').where('userId', '==', user.uid).get();
      const blockData = blockDoc.docs[0]?.data();
  
      if (blockData && blockData.blockedUsers) {
        const blockedUserIds = blockData.blockedUsers.map(user => user.userId);
        console.log('Blocked User IDs:', blockedUserIds);
        setBlockedUsers(blockedUserIds);
      } else {
        setBlockedUsers([]);
      }
  
      const userRef = firestore().collection('user_Data').doc(user.uid).collection('messageList');
  
      // Listen for real-time changes
      userRef.onSnapshot((querySnapshot) => {
        tempData = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.userId !== user.uid && !blockedUsers.includes(userData.userId)) {
            tempData.push(userData);
          }
        });
        setUserData(tempData);
        saveUserDataToStorage(tempData);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  

  const fetchUserCoinCount = async () => {
    try {
      const userCoinRef = firestore().collection('users').doc(user.uid);
      const doc = await userCoinRef.get();
      if (doc.exists) {
        const userCoinData = doc.data();
        setCoinCount(userCoinData.coin);
      }
    } catch (error) {
      console.error('Error fetching user coin count:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserCoinCount();
  }, [user])

  const getUserDataFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData !== null) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error getting user data from AsyncStorage:', error);
    }
  };

  const saveUserDataToStorage = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getUserDataFromStorage();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <AntDesign name='arrowleft' size={25} color={theme.textColor} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 18, color: theme.textColor, fontWeight: 'bold' }}>Chat with friends</Text>
        <View></View>
      </View>
      <ScrollView>
        <Text style={{ fontSize: 20, color: theme.textColor, fontWeight: '600', marginLeft: 15, marginTop: 20 }}>Messages</Text>
        <View style={styles.messageContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {userData.map((item, index) => (
              <View
                key={index}>
                <MessageCard userId={user.uid} color={theme.textColor} otherUser={item} openChat={() => navigation.navigate('Chat', { targetUserId: item.userId, targetUsername: item.username })} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
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
  search: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    backgroundColor: Colors.gray,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15
  },
  searchText: {
    fontSize: 16,
    justifyContent: 'center',
  },
  messageHeader: {
    height: 60,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  messageHeaderLeft: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  messageHeaderRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  messageSearchBar: {
    paddingLeft: 32,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    paddingVertical: 0,
    width: '85%',
  },
  coinCount: {
    minWidth: 55,
    maxWidth: 120,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 3,
  },
  coinImg: {
    height: 30,
    width: 25,
  },
  menuBar: {
    display: 'flex',
    width: 30,
    height: 30,
    borderRadius: 10,
    marginLeft: 10,
  },
  messageContent: {
    paddingHorizontal: 20,
    marginTop: 10,
    height: '100%'
  },
  touchCoinCount: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})