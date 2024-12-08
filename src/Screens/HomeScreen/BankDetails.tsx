import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Animated } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../context/ThemeContext'
import { Colors, Fonts } from '../../Styles'
import LinearGradient from 'react-native-linear-gradient'

export default function BankDetails() {

    const { isDarkMode } = useContext(ThemeContext);

    const lightTheme = {
        backgroundColor: '#ffffff',
        balanceBackgroundColor: '#3164F4',
        textColor: 'black',
        textColor1: 'black',
        iconColor: 'black',
        buttonBackgroundColor: '#FF0032',
        buttonTextColor: 'white',
    };

    const darkTheme = {
        backgroundColor: 'black',
        balanceBackgroundColor: '#3164F4',
        textColor: '#F1F1F1',
        textColor1: 'white',
        iconColor: 'white',
        buttonBackgroundColor: '#FF0032',
        buttonTextColor: 'white',
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        const tabBarStyle = theme.backgroundColor === 'black' ? { backgroundColor: 'black' } : { display: 'none' };
        navigation.getParent()?.setOptions({
            tabBarStyle: tabBarStyle
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation, theme]);
    
    const navigation = useNavigation()
    return (
        <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color={theme.textColor} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: theme.textColor, fontWeight: 'bold', marginLeft: 20 }}>Bank Accounts</Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <LinearGradient
                        colors={['#2facf2', '#0946bd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ width: '85%', height: 180, backgroundColor: 'green', borderRadius: 30, position: 'relative', marginTop: 15 }}>
                        <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', marginLeft: '60%', marginTop: 20 }}>Bank Name</Text>
                        <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>1234  1234  1234  ****</Text>
                        <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>ARYAMAN SINGH</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#2facf2', '#0946bd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ width: '85%', height: 180, backgroundColor: 'green', borderRadius: 30, position: 'relative', marginTop: 15 }}>
                        <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', marginLeft: '60%', marginTop: 20 }}>Bank Name</Text>
                        <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>1234  1234  1234  ****</Text>
                        <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>ARYAMAN SINGH</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#2facf2', '#0946bd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ width: '85%', height: 180, backgroundColor: 'green', borderRadius: 30, position: 'relative', marginTop: 15 }}>
                        <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', marginLeft: '60%', marginTop: 20 }}>Bank Name</Text>
                        <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>1234  1234  1234  ****</Text>
                        <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>ARYAMAN SINGH</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#2facf2', '#0946bd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ width: '85%', height: 180, backgroundColor: 'green', borderRadius: 30, position: 'relative', marginTop: 15 }}>
                        <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', marginLeft: '60%', marginTop: 20 }}>Bank Name</Text>
                        <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>1234  1234  1234  ****</Text>
                        <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>ARYAMAN SINGH</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#2facf2', '#0946bd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ width: '85%', height: 180, backgroundColor: 'green', borderRadius: 30, position: 'relative', marginTop: 15 }}>
                        <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', marginLeft: '60%', marginTop: 20 }}>Bank Name</Text>
                        <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>1234  1234  1234  ****</Text>
                        <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>ARYAMAN SINGH</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#2facf2', '#0946bd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ width: '85%', height: 180, backgroundColor: 'green', borderRadius: 30, position: 'relative', marginTop: 15 }}>
                        <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', marginLeft: '60%', marginTop: 20 }}>Bank Name</Text>
                        <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>1234  1234  1234  ****</Text>
                        <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>ARYAMAN SINGH</Text>
                    </LinearGradient>
                    {/* Add more LinearGradient components as needed */}
                </View>
            </ScrollView>
            <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20, height: 60, width: 60, borderRadius: 20, backgroundColor: '#2bc791', justifyContent: 'center', alignItems: 'center', zIndex: 1 }} onPress={() => navigation.navigate('AddBankDetails')}>
                <Feather name='plus' size={30} color={'white'} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingBottom: 60
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        position: 'relative',
        flexDirection: 'row'
    },
})