import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Header({ theme, coinCount }) {
    const navigation = useNavigation()
    return (
        <View style={[styles.header, { backgroundColor: theme.backgroundColor }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <AntDesign name="search1" size={25} color={theme.textColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.coinCount} onPress={() => navigation.navigate('MyBalance1')}>
                <Text style={{ color: theme.textColor, fontSize: 20 }}>{coinCount}</Text>
                <Image
                    style={styles.coinImg}
                    source={require('../assets/coin.png')}
                />
            </TouchableOpacity>
            <Ionicons
                name="notifications-outline"
                size={25}
                color={theme.textColor}
                style={{ marginLeft: 15 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 50,
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