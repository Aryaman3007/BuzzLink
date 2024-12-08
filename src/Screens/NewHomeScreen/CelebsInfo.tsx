import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Colors } from '../../Styles';
import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CelebsInfo() {

    const { data } = useRoute().params;
    const { isDarkMode } = useContext(ThemeContext);
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

    const navigation  = useNavigation()

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: theme.backgroundColor, paddingBottom: 90}}>
            <View style={{ height: 80, width: '100%' }}></View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 400, width: '90%', position: 'relative', borderRadius: 15 }} source={require('../../assets/avatar.jpg')} />
                <View style={{ flexDirection: 'column', position: 'absolute', top: 230, alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 35, fontWeight: '500', color: 'white', width: '80%', textAlign: 'center' }}>Welcome to the Influencer Section!</Text>
                    <TouchableOpacity style={{ marginTop: 10, borderColor: '#282827', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('VisitProfile' , {data: data})}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Explore</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: '#b7b7b0', paddingHorizontal: 20, paddingVertical: 15, justifyContent: 'center', alignItems: 'center', width: '90%', alignSelf: 'center', marginTop: 20, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontSize: 25 }}>Ad Slider Section</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '90%', alignSelf: 'center', marginTop: 30 }}>
                <Text style={{ color: theme.textColor, fontSize: 25, fontWeight: '500' }}>Influencer Section</Text>
                <Text style={{ marginTop: 5, color: theme.textColor }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Error officia nihil itaque tempore magni, quasi vel, quis eveniet, aperiam accusamus iure ipsum accusantium eum quo nisi perspiciatis veritatis! Doloremque, maxime?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio praesentium eaque, delectus similique nesciunt sapiente sunt perspiciatis exercitationem eum esse deserunt odit officiis atque nihil? Qui deleniti assumenda adipisci totam?
                </Text>
                <TouchableOpacity style={{justifyContent: 'center',paddingHorizontal: 15, paddingVertical: 5,alignItems: 'center', borderWidth: 0.5, borderColor:theme.textColor, alignSelf: 'center', marginTop: 25}}>
                    <Text style={{fontSize: 20, color: theme.textColor}}>Q&A</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})