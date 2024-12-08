import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../Styles';
import firestore from '@react-native-firebase/firestore'
import { useCurrentUser } from '../context/UserContext';
import { AuthContext } from '../context/AuthProvider';

export default function StarsWaitingDetails({ username, targetUserId }) {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);
    const [numberOfWaitingCalls, setNumberOfWaitingCalls] = useState(0)
    const [waitingUsers, setWaitingUsers] = useState([])
    const currentUser = useCurrentUser();
    const { user } = useContext(AuthContext)

    const lightTheme = {
        backgroundColor: '#e6ffe6',
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
    };

    const darkTheme = {
        backgroundColor: '#262626',
        textColor: Colors.light,
        iconColor: '#262626',
    };

    const imageSource = isDarkMode
        ? require('../assets/action.png')
        : require('../assets/actionBlack.png');

    const theme = isDarkMode ? darkTheme : lightTheme;

    const userInfo = async () => {
        try {
            let tempData = []
            const waitingUsersData = await firestore()
                .collection('influencerCallRooms')
                .doc(targetUserId)
                .collection('waitingCalls')
                .get();
            tempData = waitingUsersData.docs.map((doc) => doc.data());
            setWaitingUsers(tempData);

        } catch (error) {
            console.error('Error fetching waiting users:', error);
        }
    }

    const handleDelete = async () => {
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
                            const userDocRef = firestore().collection('user_Data').doc(user.uid);
                            await userDocRef.collection('callRequests').doc(user.uid + targetUserId).delete();
                            console.log('Document deleted successfully.');

                            const influencerRoomRef = firestore().collection('influencerCallRooms').doc(targetUserId);
                            await influencerRoomRef.collection('waitingCalls').doc(user.uid).delete();
                            console.log('Document deleted successfully from waitingCalls collection.');

                        } catch (error) {
                            console.error('Error deleting document:', error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        userInfo();
    }, [targetUserId])

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={[styles.container1, { backgroundColor: theme.backgroundColor }]}>
                <Image style={styles.image} source={require('../assets/chatchat.png')} />
            </View>
            <View style={styles.container12}>
                <Text style={[styles.tweet, { color: theme.textColor }]}>{username}</Text>
                <View style={styles.interestContainer}>
                    <Image style={styles.image2} source={require('../assets/group.png')} />
                    <Text style={[styles.interestedText, { color: theme.textColor }]}>
                        {waitingUsers?.length}/30 waiting
                    </Text>
                </View>
                <TouchableOpacity onPress={handleDelete}>
                    <Text style={{ color: theme.textColor, fontWeight: 'bold', marginTop: 10 }}>Delete</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.container13}>
                <Image style={styles.image1} source={imageSource} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: 5,
    },
    container1: {
        flexDirection: 'column',
        borderRadius: 20,
        padding: 15
    },
    container12: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginStart: 3,
        marginTop: 13,
        width: 250,
        height: 45,
        flexDirection: 'column',
    },
    container13: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    image: {
        borderRadius: 12,
        marginRight: 5,
        height: 48,
        width: 48,
    },
    image1: {
        borderRadius: 12,
        marginRight: 5,
        height: 28,
        width: 28,
    },
    interestedText: {
        fontWeight: 'bold',
        fontSize: 15
    },
    tweet: {
        fontWeight: 'bold',
        fontSize: 17
    },
    interestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image2: {
        height: 20,
        width: 40,
        marginEnd: 10,
    }
})