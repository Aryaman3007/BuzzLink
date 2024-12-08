import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthProvider';
import firestore from '@react-native-firebase/firestore'
import { useCurrentUser } from '../../context/UserContext';

const ProfileCard: React.FC = ({ username, id }) => {

  const { user } = useContext(AuthContext)
  const currentUser = useCurrentUser()
  
  const handleCallButtonPress = async () => {
    await firestore()
      .collection('influencerCallRooms')
      .doc(id) // Assuming 'user.uid' is the ID of the influencerCallRooms document
      .set({}, { merge: true });

    await firestore()
      .collection('influencerCallRooms')
      .doc(id)
      .collection('waitingCalls')
      .doc(user.uid)
      .set({
        userId: user.uid,
        username: currentUser.username,
      });
    Alert.alert('User added to WaitingCalls list')
  };

  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: 'https://png.pngtree.com/thumb_back/fw800/background/20230516/pngtree-avatar-of-a-man-wearing-sunglasses-image_2569096.jpg' }}
        style={styles.profileImage}
      />
      <View style={styles.coinContainer}>
        <Text style={styles.coinText}>50</Text>
        {/* <Icon name="coin" size={16} color="#ffd700" /> */}
      </View>
      <TouchableOpacity style={styles.callButton} onPress={handleCallButtonPress}>
        <Icon name="phone" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.profileName}>{username}</Text>
      <Icon name="check-decagram" size={24} color="#34A853" style={styles.checkIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 28,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  coinContainer: {
    position: 'absolute',
    top: 70,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 12,
    padding: 4,
  },
  coinText: {
    color: '#ffd700',
    marginRight: 2,
    fontSize: 14,
  },
  callButton: {
    position: 'absolute',
    bottom: 30,
    right: -10,
    backgroundColor: '#4CD964',
    borderRadius: 20,
    padding: 5,
  },
  profileName: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkIcon: {
    position: 'absolute',
    top: 105,
    right: 0,
  },
});

export default ProfileCard;
