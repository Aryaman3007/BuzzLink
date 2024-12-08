import React, { useEffect, useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../context/AuthProvider';
import LiveFeed from './LiveFeed';
import { Colors } from '../../Styles';

export default function RisingStar({ navigation }) {

    const { user } = useContext(AuthContext)
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let tempData = [];
                const snapshot = await firestore()
                    .collection('users')
                    .where('userId', '!=', user.uid)
                    .get()
                    .then(res => {
                        if (res.docs != []) {
                            res.docs.map(item => {
                                tempData.push(item.data());
                            });
                        }
                        setUserData(tempData);
                    });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [user.uid]);

    const openSearchScreen = () => {
        navigation.navigate('Search');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View style={{ paddingLeft: 20 }}>
                    <Ionicons name='chevron-back' size={25} color={'white'} onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={openSearchScreen}>
                        <AntDesign name="search1" size={25} color={'white'} />
                    </TouchableOpacity>
                    <View style={styles.coinCount}>
                        <View>
                            <Text style={{ color: 'white', fontSize: 20 }}>50</Text>
                        </View>
                        <View>
                            <Image
                                style={styles.coinImg}
                                source={require('../../assets/coin.png')}
                            />
                        </View>
                    </View>
                    <Ionicons
                        name="notifications-outline"
                        size={25}
                        color={'white'}
                        style={{ marginLeft: 15 }}
                    />
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, color: 'white', marginLeft: 20}}>All</Text>
            <Entypo name='triangle-down' size={15} color={'white'}/>
            </View>
            {userData.map((item, index) => (
                <View key={index}
                style={{
                  marginHorizontal: 15,
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <Image source={require('../../assets/avatar.jpg')} style={{
                  width: 60,
                  height: 60,
                  backgroundColor: 'white',
                  borderRadius: 30,
                  zIndex: 99
                }} />
                <View
                  style={{
                    flex: 1,
                    height: 60,
                    marginLeft: -60,
                    backgroundColor: '#3A1B12',
                    borderRadius: 30,
                  }}>
                  <Text style={{ color: 'white', marginLeft: 70, marginTop: 10, fontWeight: '600' }}>{item.username}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 70 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Entypo name='dot-single' size={20} color={'#66ff66'} style={{ left: -4 }} />
                      <Text style={{ fontSize: 12, color: '#66ff66', left: -7 }}>available</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                      <Text style={{ fontSize: 13, color: 'white' }}>50</Text>
                      <Image style={{ height: 26, width: 26 }} source={require('../../assets/Coins.png')} />
                      <Text style={{ fontSize: 13, color: 'white' }}>/min</Text>
                    </View>
                  </View>
                  <View style={{marginLeft: '80%', position: 'absolute', marginTop: 5}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{ fontSize: 11, marginRight: 5, color: 'white' }}>4.2</Text>
                      <FontAwesome name='star-half-empty' size={13} color={'#fecc01'} />
                    </View>
                    <TouchableOpacity style={{marginTop: 5}}>
                      <MaterialIcons name='add-call' size={25} color={'#66ff66'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
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
})