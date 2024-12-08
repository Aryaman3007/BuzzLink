import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BalanceHistoryCard from './BalanceHistoryCard';
import { ThemeContext } from '../../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MyBalance = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);
    const [coinValue, setCoinValue] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [showAllPayments, setShowAllPayments] = useState(false);

    useEffect(() => {
        const fetchUserCoinValue = async () => {
            try {
                const userId = auth().currentUser.uid;
                const userDoc = await firestore().collection('users').doc(userId).get();

                if (userDoc.exists) {
                    const coinValue = userDoc.data()?.coin;
                    setCoinValue(coinValue);
                }
            } catch (error) {
                console.error('Error fetching user coin value: ', error);
            }
        };

        const fetchPaymentHistory = async () => {
            try {
                const userId = auth().currentUser.uid;
                const paymentsSnapshot = await firestore().collection('Payments').where('userId', '==', userId).get();

                const paymentData = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                paymentData.sort((a, b) => b.date.toMillis() - a.date.toMillis());

                setPaymentHistory(paymentData);
            } catch (error) {
                console.error('Error fetching payment history: ', error);
            }
        };

        fetchUserCoinValue();
        fetchPaymentHistory();
    }, []);

    const toggleShowAllPayments = () => {
        setShowAllPayments(!showAllPayments);
    };

    const handlePurchase = () => {
        navigation.navigate('BuyCoin');
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <View style={styles.backContainer}>
                        <FontAwesome name='chevron-left' size={24} color={theme.iconColor} onPress={() => navigation.goBack()} />
                    </View>
                    <View style={styles.mainBalancle}>
                        <View style={[styles.balanceContainer, { backgroundColor: theme.balanceBackgroundColor }]}>
                            <Text style={[styles.text1, { color: theme.textColor }]}>Coins Balance</Text>
                            <Text style={[styles.text2, { color: theme.textColor }]}>{coinValue !== null ? coinValue : 'Loading...'}</Text>
                        </View>
                    </View>
                    <View style={styles.history}>
                        <Text style={[styles.historyText, { color: theme.textColor }]}>History</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.historyCards}>
                            {paymentHistory.length > 0 ? (
                                showAllPayments
                                    ? paymentHistory.map((payment, index) => (
                                        <BalanceHistoryCard key={index} payment={payment} />
                                    ))
                                    : paymentHistory.slice(0, 2).map((payment, index) => (
                                        <BalanceHistoryCard key={index} payment={payment} />
                                    ))
                            ) : (
                                <Text style={[styles.noTransactionsText, { color: theme.textColor }]}>No transactions yet</Text>
                            )}
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.viewContainer} onPress={toggleShowAllPayments}>
                        {paymentHistory.length > 0 && (
                            <Text style={[styles.viewall, { color: theme.textColor1 }]}>{showAllPayments ? 'Show Less' : 'View All'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} onPress={handlePurchase}>
                            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>purchase</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}>
                            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

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

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    mainContainer: {
        flex: 1,
    },
    backContainer: {
        margin: 30,
    },
    mainBalancle: {
        alignItems: 'center',
        marginTop: 30,
    },
    balanceContainer: {
        height: 150,
        width: 370,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text1: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
    },
    text2: {
        margin: 10,
        fontSize: 50,
        fontWeight: 'bold',
    },
    history: {
        margin: 30,
    },
    historyText: {
        fontWeight: 'bold',
        fontSize: 23,
    },
    historyCards: {
        marginEnd: 20,
        marginStart: 20,
    },
    viewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewall: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    button: {
        width: 160,
        height: 60,
        margin: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginTop: 150,
        marginBottom: 50,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    noTransactionsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MyBalance;
