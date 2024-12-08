import React, { useContext,useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors, Fonts } from '../../Styles';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthProvider';
import firestore from '@react-native-firebase/firestore'
import StarsWaitingDetails from '../../components/StarsWaitingDetails';

const StarsScreen: React.FC<StarsScreenProps & { postId: string }> = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);
    const {user} = useContext(AuthContext)

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
        ? require('../../assets/action.png')
        : require('../../assets/actionBlack.png');

    const theme = isDarkMode ? darkTheme : lightTheme;
    const [waitingList, setWaitingList] = useState([]);

    const getUserWaitingList = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('user_Data')
                .doc(user.uid)
                .collection('callRequests')
                .get();

            const userWaitingList = [];
            querySnapshot.forEach((doc) => {
                userWaitingList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setWaitingList(userWaitingList)
        } catch (error) {
            console.error('Error retrieving userWaitingList:', error);
            return [];
        }
    };

    useEffect(() => {
        getUserWaitingList();
    }, [user])

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

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {waitingList.map((list, index) => (
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
                    <TouchableOpacity style={styles.pickRandom} onPress={handleDeleteAll}>
                        <Text style={{ color: Colors.light, fontSize: 18, fontWeight: '600' }}>Delete All</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: 5,
    },
    scroll: {
        marginBottom: 10,
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

export default StarsScreen;
