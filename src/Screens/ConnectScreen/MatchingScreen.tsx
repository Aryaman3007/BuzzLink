import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../Styles';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ActivityIndicator} from 'react-native';
import LottieView from "lottie-react-native";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { AuthContext } from '../../context/AuthProvider';


const MatchingScreen = (props: any) => {
  const { user, logout } = useContext(AuthContext)

  useEffect(()=>{
    updateIsLookingForMatch(true , "FjXb9J3mDyA8GSXgrz1z");

    matchUsersInBucket(user.uid)
  },[])

  useEffect(() => {
    return () => {
      updateIsLookingForMatch(false, "FjXb9J3mDyA8GSXgrz1z");
    };
  }, []);


  const updateIsLookingForMatch = async (value: boolean, id: string) => {
    try {
      await firestore().collection('Connect').doc(id).update({
        isLookingForMatch: value,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    const unsubscribe = firestore().collection('Connect')
      .doc("FjXb9J3mDyA8GSXgrz1z")
      .onSnapshot((doc) => {
        const userData = doc.data();
        // setUser(userData);
      });

    return () => unsubscribe();
  }, [user.id, user.bucketId]);

  async function matchUsersInBucket(id: string) {
    try {
      const bucketUsersRef = firestore().collection('Connect');
  
      const snapshot = await bucketUsersRef.where('isLookingForMatch', '==', true).get();
      const potentialMatches = snapshot.docs.map(doc => doc.data());
       
        const curUser = (await bucketUsersRef.where('userId', '==', id).get()).docs[0];
        
        const lockUpdateResult = await bucketUsersRef.doc(curUser.id).update({ isSearchingLock: true });
        if (true) {

          const matchCandidate = potentialMatches.find(candidate => candidate.userId !== user.uid && !candidate.isSearchingLock);
          if (matchCandidate && isCompatibleMatch(user, matchCandidate) && !hasBeenMatched(user.id, matchCandidate.id)) {
            console.log(`Matching ${user.uid} with ${matchCandidate.userId}`);
            
            const connectionDataCur = { userId: matchCandidate.userId, timestamp: Date.now() };
            const connectionDataMatched = { userId: user.uid, timestamp: Date.now() };

            const matchedUser = (await bucketUsersRef.where('userId', '==', matchCandidate.userId).get()).docs[0];

            await bucketUsersRef.doc(curUser.id).update({
              matchedUserId: matchCandidate.userId,
              isLookingForMatch: false,
              isSearchingLock: false,
              connections: [connectionDataCur, ...curUser.data().connections],
            });
      
            await bucketUsersRef.doc(matchedUser.id).update({
              matchedUserId: user.uid,
              isLookingForMatch: false,
              isSearchingLock: false,
              connections: [connectionDataMatched, ...matchCandidate.connections],
            });
          
        }
      }
    } catch (error) {
      console.error('Error matching users:', error);
    }
  }
  function isCompatibleMatch(user: FirebaseFirestoreTypes.DocumentData, matchCandidate: FirebaseFirestoreTypes.DocumentData) {
    
    return true;
  }
  
  function hasBeenMatched(userId1: any, userId2: any) {
    return false;
  }
  
  const [isButtonLoading, settIsButtonLoading] = useState(false);
  return (
    <View style={styles.container}>
        <View style={styles.findMatchContainer}>
          <View style={styles.leftUser}></View>
          <View style={styles.RightUser}></View>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgcolor,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  leftUser: {width: 100, height:100, backgroundColor:"lightgray", borderRadius:50},
  RightUser: {width: 100, height:100, backgroundColor:"lightgray",borderRadius:50},

  findMatchButton: {
    backgroundColor: '#FF0032',
    width: 200,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 20,
  },
  findMatchContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    width:"100%",
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'blue',
  },
  ruleContainer: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  ruleText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
});

export default MatchingScreen;
