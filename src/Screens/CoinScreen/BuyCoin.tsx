import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Colors, Fonts } from '../../Styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CoinBuyCard from './CoinBuyCard';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Razorpay, { PaymentSuccessResponse, PaymentErrorResponse } from 'react-native-razorpay';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const BuyCoin: React.FC = () => {
    const [coinValue, setCoinValue] = useState(null);
    const [count, setCount] = useState(100);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

    const increment = () => {
        setCount(prevCount => prevCount + 2);
    };

    const decrement = () => {
        setCount(prevCount => prevCount - 2);
    };

    const fetchUserCoinValue = async () => {
        try {
            const userId = auth().currentUser.uid;
            const userDoc = await firestore().collection('users').doc(userId).get();

            if (userDoc.exists) {
                const coinValue = userDoc.data().coin;
                setCoinValue(coinValue);
            }
        } catch (error) {
            console.error('Error fetching user coin value: ', error);
        }
    };

    const subscribeToCoinValueChanges = () => {
        const userId = auth().currentUser.uid;
        const userDocRef = firestore().collection('users').doc(userId);

        const unsubscribe = userDocRef.onSnapshot((doc) => {
            const coinValue = doc.data()?.coin;
            setCoinValue(coinValue);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribeCoinValue = subscribeToCoinValueChanges();
        fetchUserCoinValue();

        return () => {
            unsubscribeCoinValue();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUserCoinValue();
            const unsubscribeCoinValue = subscribeToCoinValueChanges();

            return () => {
                unsubscribeCoinValue();
            };
        }, [])
    );

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);

            const options = {
                key: 'rzp_test_JcuwMLWEaUqFF1',
                amount: count * 100,
                name: 'Raf_ALPHA',
                description: 'Payment for coins',
                prefill: {
                    email: 'Raf_Alpha@gmail.com',
                    contact: '8985346102',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const response = await Razorpay.open(options);

            if (response?.razorpay_payment_id) {
                const userId = auth().currentUser.uid;

                const paymentData = {
                    userId: userId,
                    amount: count,
                    paymentId: response?.razorpay_payment_id || null,
                    status: 'success',
                    timestamp: new Date(),
                    date: new Date().getDate(),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),
                    addedCoins: parseInt(count / 2, 10),
                };

                await firestore().collection('Payments').add(paymentData);

                const userDoc = await firestore().collection('users').doc(userId).get();
                const existingCoinValue = userDoc.data()?.coin || 0;

                const updatedCoinValue = parseInt(existingCoinValue, 10) + parseInt(count / 2, 10);

                await firestore().collection('users').doc(userId).update({
                    coin: updatedCoinValue.toString(),
                });

                console.log('Payment Success:', response);
                Alert.alert('Payment Successful', `Coins updated: ${updatedCoinValue}`);
            } else {
                console.error('Payment Failed');
                Alert.alert('Payment Failed', 'Please try again');
            }
        } catch (error) {
            console.error('Payment Error:', error);

            const userId = auth().currentUser.uid;
            const paymentData = {
                userId: userId,
                amount: count,
                paymentId: null,
                status: 'failure',
                date: new Date(),
                addedCoins: 0,
            };

            await firestore().collection('Payments').add(paymentData);
            Alert.alert('Payment Error', 'An error occurred during payment');
        } finally {
            setLoading(false);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.backgroundColor }]}>
            <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                <View style={[styles.topBar, { backgroundColor: theme.headerColor }]}>
                    <View style={styles.goldoutline}>
                        <Text style={[styles.coinText, { color: theme.textColor }]}>
                            {coinValue !== null ? coinValue : ''}
                        </Text>
                        <Image style={styles.image} source={require('../../assets/coin.png')} />
                    </View>
                    <Icon name="bell" size={24} color={theme.iconColor} />
                </View>
                <View style={styles.mainmain}>
                    <View style={styles.mainContainer}>
                        <View style={styles.cardContainer}>
                            <CoinBuyCard />
                        </View>
                        <View style={styles.cardContainer}>
                            <CoinBuyCard />
                        </View>
                        <View style={styles.cardContainer}>
                            <CoinBuyCard />
                        </View>
                    </View>
                    <View style={styles.mainContainer1}>
                        <View style={styles.cardContainer}>
                            <CoinBuyCard />
                        </View>
                        <View style={styles.cardContainer}>
                            <CoinBuyCard />
                        </View>
                        <View style={styles.cardContainer}>
                            <CoinBuyCard />
                        </View>
                    </View>
                </View>
                <View style={styles.count}>
                    <TouchableOpacity onPress={decrement} style={styles.button}>
                        <FontAwesome name="minus" size={20} color={theme.textColorBack} />
                    </TouchableOpacity>
                    <View style={styles.countTextContainer}>
                        <Text style={[styles.countText, { color: theme.textColor }]}>₹ {count}</Text>
                        <View style={[styles.horizontalLine, { backgroundColor: theme.textColor }]} />
                    </View>
                    <TouchableOpacity onPress={increment} style={styles.button1}>
                        <FontAwesome name="plus" size={20} color={theme.textColor} />
                    </TouchableOpacity>
                </View>
                <View style={styles.button2}>
                    <TouchableOpacity
                        style={[styles.buyButton, { backgroundColor: theme.buttonColor }]}
                        onPress={handleRazorpayPayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <Text style={styles.buyText}>Buy Now</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const lightTheme = {
    backgroundColor: 'white',
    buttonColor: 'red',
    textColor: 'black',
    iconColor: 'black',
    textColorBack: 'black',
    headerColor: 'white',
    purchaseColor: 'black'
};

const darkTheme = {
    backgroundColor: 'black',
    buttonColor: 'red',
    textColor: 'white',
    textColorBack: 'black',
    iconColor: 'white',
    headerColor: 'black',
    purchaseColor: '#333333'
};

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    mainmain: {
        alignContent: 'center',
        justifyContent: 'center',
        top: 10,
        flex: 1
    },
    mainContainer: {
        flexDirection: 'row',
        marginTop: 60,
        width: '100%',
        justifyContent: 'center'
    },
    mainContainer1: {
        flexDirection: 'row',
        marginTop: 30,
        width: '100%',
        justifyContent: 'center'
    },
    cardContainer: {
        margin: 7,
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        margin: 20
    },
    button1: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        margin: 20
    },
    countText: {
        fontSize: 30,
        paddingHorizontal: 10,
    },
    buyButton: {
        width: 250,
        height: 70,
        backgroundColor: 'red',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 50,
        marginTop: 20,
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyText: {
        color: 'white',
        fontSize: 27,
        fontWeight: 'bold'
    },
    count: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    textCount: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginEnd: 5,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: 'white'
    },
    coinText: {
        fontWeight: 'bold',
        fontSize: 16,
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center',
    },
    goldoutline: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gold',
        borderRadius: 5,
        marginEnd: 10,
        padding: 5,
    },
    button2: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    countTextContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    countText: {
        fontSize: 30,
        paddingHorizontal: 10,
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%',
        marginTop: 5,
    },
    image: {
        height: 25,
        width: 25
    }
});

export default BuyCoin;
