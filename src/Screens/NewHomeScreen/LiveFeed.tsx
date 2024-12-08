import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../context/AuthProvider';
import TweetCard from '../TweetScreen/TweetCard';
import TweetMessage from '../TweetScreen/TweetMessage';
import { Colors } from '../../Styles';

export default function LiveFeed() {
    const { user } = useContext(AuthContext)
    const [userData, setUserData] = useState([])
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTweets = () => {
      try {
        const unsubscribe = firestore()
          .collection('Topics')
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot => {
            const fetchedTweets = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTweets(fetchedTweets);
            setLoading(false);
          });
  
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching tweets: ', error);
        setLoading(false);
      }
    };
      

    useEffect(() => {
        fetchTweets();
    }, [])

    return (
        <View style={[styles.container, { backgroundColor: Colors.textColor }]}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {tweets.map(tweet => (
                    <TweetMessage key={tweet.id} tweet={tweet} />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    scroll: {
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: 'black'
    },
    tweetPost: {
    },
})