import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Colors, Fonts } from '../../Styles'
import auth from "@react-native-firebase/auth"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HomeScreen from '../HomeScreen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSTANTS } from '../../constants/constants';

const ThirdScreen: React.FC = ( { navigation}) => {

    const onSkip = () => {
        navigation.navigate('MainNavigator', { screen: 'Home' });

        AsyncStorage.setItem(CONSTANTS.firstTimeOpen, 'false'); 
        // navigation.navigate('OTPLogin');
    };

    const onPrev = () => {
        navigation.navigate('SecondScreen')
    };

    const onNext = () => {
        AsyncStorage.setItem(CONSTANTS.firstTimeOpen, 'false'); 
        navigation.navigate('MainNavigator', { screen: 'Home' });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.indicatorContainer}>
                <View style={styles.inactiveIndicator} />
                <View style={styles.inactiveIndicator} />
                <View style={styles.activeIndicator} />
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={onPrev}>
                    <Text style={styles.bottomButtons}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onNext}>
                    <Text style={styles.bottomButtons}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    skipButton: {
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
    },
    skipText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 22,
    },
    indicatorContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    inactiveIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'grey',
        margin: 5,
    },
    activeIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
        margin: 5,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
    },
    bottomButtons: {
        color: 'red',
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default ThirdScreen;