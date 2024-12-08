import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, Alert } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'

export default function AddBankDetails() {

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

    const navigation = useNavigation();
    const [accountName, setAccountName] = useState("");
    const [accountNo, setAccountNo] = useState("");
    const [bankName, setBankName] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [isifscTyped, setIsIfscTyped] = useState(false);
    const [phoneNo, setPhoneNo] = useState("");
    const flipAnim = useRef(new Animated.Value(0)).current;

    const formatCardNumber = (input) => {
        const digitsOnly = input.replace(/\D/g, '');
        const groups = digitsOnly.match(/.{1,4}/g);
        return groups ? groups.join(' ') : '';
    };

    const handleCardNumberChange = (input) => {
        const digitsOnly = input.replace(/\D/g, '');
        const truncatedInput = digitsOnly.substring(0, 16);
        const formattedInput = formatCardNumber(truncatedInput);
        setAccountNo(formattedInput);
    };

    const flipCard = (toBack) => {
        const toValue = toBack ? 1 : 0;
        Animated.timing(flipAnim, {
            toValue: toValue,
            duration: 500,
            useNativeDriver: true
        }).start();
        setIsIfscTyped(toBack);
    };

    const addBankDetails = async () => {
        try {
            setAccountName("");
            setAccountNo("");
            setBankName("");
            setIfsc("");
            setPhoneNo("");
            Alert.alert("Bank details added successfully!");
            await firestore().collection('bankDetails').add({
                accountName: accountName,
                accountNo: accountNo,
                bankName: bankName,
                ifsc: ifsc,
                phoneNo: phoneNo,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error adding bank details: ", error);
            Alert.alert("Error adding bank details. Please try again later.");
        }
    };


    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.backgroundColor }} keyboardShouldPersistTaps='handled'>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <AntDesign name='arrowleft' size={25} color={'white'} onPress={() => navigation.goBack()} />
                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 20 }}>Add Bank Details</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ width: '90%', height: 180, borderRadius: 20, position: 'relative', alignSelf: 'center' }}>
                    <Animated.View style={{ transform: [{ rotateY: flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }] }}>
                        {!isifscTyped ? (
                            <LinearGradient
                                colors={['#2facf2', '#0946bd']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0.8, y: 0 }}
                                style={{ width: '90%', height: 180, borderRadius: 20, position: 'relative', marginTop: 55, alignSelf: 'center' }}>
                                <Image source={require('../../assets/chip.png')} style={{ height: 30, width: 50, position: 'absolute', marginLeft: 20, marginTop: 20 }} />
                                <Text style={{ fontSize: 18, fontWeight: '400', color: '#f2f2f2', textAlign: 'right', marginRight: 20, marginTop: 20 }}>{bankName || 'Bank Name'}</Text>
                                <Text style={{ alignSelf: 'center', marginTop: 30, fontSize: 20, fontWeight: '600', color: 'white' }}>{accountNo ? accountNo : 'xxxx xxxx xxxx xxxx'}</Text>
                                <Text style={{ fontSize: 18, color: 'white', marginLeft: 20, marginTop: 30 }}>{accountName ? accountName : 'Card Holder Name'}</Text>
                            </LinearGradient>
                        ) : (
                            <LinearGradient
                                colors={['#2facf2', '#0946bd']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0.8, y: 0 }}
                                style={{ width: '90%', height: 180, borderRadius: 20, position: 'relative', marginTop: 55, alignSelf: 'center' }}>
                                <View style={{ width: '100%', height: 35, backgroundColor: '#1a1a1a', marginTop: 20 }}></View>
                                <View style={{ width: '80%', height: 30, backgroundColor: '#ffffff', marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#d9d9d9', width: '80%', height: 30 }}></View>
                                    <Text style={{ fontSize: 16, color: 'black', textAlign: 'center', marginLeft: 5 }}>
                                        {ifsc ? ifsc.substring(0, 2) + '*' : '***'}
                                    </Text>
                                </View>
                            </LinearGradient>
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 20, marginTop: 100 }}>
                <TextInput
                    label="Full Name"
                    value={accountName}
                    onChangeText={text => setAccountName(text.toUpperCase())} // Convert input to uppercase
                    autoCapitalize='characters' // Automatically capitalize each character
                    mode='outlined'
                    style={styles.input}
                    onPressIn={() => flipCard(false)}

                />
                <TextInput
                    label="Account Number"
                    value={accountNo}
                    onChangeText={handleCardNumberChange}
                    placeholder="xxxx xxxx xxxx xxxx"
                    maxLength={19} // Set the maximum length considering spaces
                    keyboardType='numeric'
                    mode='outlined'
                    style={styles.input}
                    onPressIn={() => flipCard(false)}
                />
                <TextInput
                    label="Bank Name"
                    value={bankName}
                    onChangeText={text => setBankName(text)}
                    mode='outlined'
                    style={styles.input}
                    onPressIn={() => flipCard(false)}
                />
                <TextInput
                    label="IFSC Code"
                    value={ifsc}
                    onChangeText={text => setIfsc(text)}
                    keyboardType='numeric'
                    mode='outlined'
                    style={styles.input}
                    onPressIn={() => flipCard(true)}
                />
                <TextInput
                    label="Phone Number"
                    value={phoneNo}
                    onChangeText={text => setPhoneNo(text)}
                    keyboardType='numeric'
                    mode='outlined'
                    style={styles.input}
                    onPressIn={() => flipCard(true)}
                />
            </View>
            <TouchableOpacity 
            style={{ backgroundColor: '#0059b3', width: '80%', alignSelf: 'center', marginTop: 30, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
            onPress={addBankDetails}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: '500' }}>Add Bank Details</Text>
            </TouchableOpacity>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#4642d5',
        position: 'relative',
        height: 200,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40
    },
    input: {
        marginVertical: 10
    },
    input1: {
        marginVertical: 10,
        width: '30%'
    },
    cardContainer: {
        width: '90%',
        height: 180,
        borderRadius: 20,
        position: 'relative',
        marginTop: 55,
        alignSelf: 'center'
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        position: 'relative',
        padding: 20
    },
    chipImage: {
        height: 30,
        width: 50,
        position: 'absolute',
        marginLeft: 20,
        marginTop: 20
    },
    bankName: {
        fontSize: 18,
        fontWeight: '400',
        color: '#f2f2f2',
        textAlign: 'right',
        marginRight: 20,
        marginTop: 20
    },
    cardNumber: {
        alignSelf: 'center',
        marginTop: 30,
        fontSize: 20,
        fontWeight: '600',
        color: 'white'
    },
    cardHolder: {
        fontSize: 18,
        color: 'white',
        marginLeft: 20,
        marginTop: 30
    },
    ifsc: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        marginTop: 60
    },
})