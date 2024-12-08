import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../../Styles';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from '../../context/UserContext';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../context/AuthProvider';

export default function BlockListScreen() {

    const { isDarkMode } = useContext(ThemeContext)
    const navigation = useNavigation()
    const [blockedUsers, setBlockedUsers] = useState([])
    const currentUser = useCurrentUser()
    const { user } = useContext(AuthContext)

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

    const fetchBlockedUsers = async () => {
        const blockDoc = await firestore().collection('users').where('userId', '==', user.uid).get();
        const blockData = blockDoc.docs[0]?.data();
        
        if (blockData && blockData.blockedUsers) {
            setBlockedUsers(blockData.blockedUsers);
        } else {
            setBlockedUsers([]);
        }
    }
    
    console.log(blockedUsers)

    const unblockUser = async (userId) => {
        try {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to unblock this user?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Unblock',
                        onPress: async () => {
                            const updatedBlockedUsers = blockedUsers.filter(user => user.userId !== userId);
                            setBlockedUsers(updatedBlockedUsers);

                            await firestore()
                                .collection('users')
                                .doc(user.uid)
                                .update({
                                    blockedUsers: updatedBlockedUsers
                                });

                            fetchBlockedUsers();
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, [user]);

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header}>
                <AntDesign name='arrowleft' size={25} color={theme.textColor} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 18, color: theme.textColor, fontWeight: 'bold' }}>Block List</Text>
                <View></View>
            </View>
            <View style={styles.blockList}>
                {blockedUsers.map((item, index) => (
                    <View style={styles.blockedUser} key={index}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ height: 70, width: 70, borderRadius: 25 }} source={require('../../assets/avatar.jpg')} />
                            <View style={{ marginLeft: 18 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textColor }}>Aryaman Singh</Text>
                                <Text style={{ fontSize: 15, fontWeight: '500', color: Colors.grey }}>@{item.userName}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.unblock} onPress={() => unblockUser(item.userId)}>
                                <Text style={{ color: Colors.light, fontWeight: '500' }}>Unblock</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
                }
            </View>
        </View>
    )
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
    blockList: {
        paddingHorizontal: 15,
        flexDirection: 'column'
    },
    blockedUser: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    unblock: {
        backgroundColor: '#4884fc',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12
    }
})