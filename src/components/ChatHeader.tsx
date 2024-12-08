import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export default function ChatHeader({username,id,navigation}) {
    return (
        <View style={styles.header}>
            <Text style={styles.headerUsername}>{username}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CallPage', { username: {username}, id: {id}})}>
                <MaterialCommunityIcons name='phone' color={'white'} size={28} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        width: '100%',
        backgroundColor: '#383434',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems :'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerUsername: {
        color: 'white',
        fontSize: 20,
        marginLeft: 20
    },

})