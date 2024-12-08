import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    StyleSheet, TouchableOpacity, View, Text, ScrollView, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BalanceHistoryCard from './BalanceHistoryCard';
import { ThemeContext } from '../../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../../context/AuthProvider';
import { Colors } from '../../Styles';
import ChartStats from '../../components/ChartStats';

const MyBalance1 = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);
    const [coinValue, setCoinValue] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [showAllPayments, setShowAllPayments] = useState(false);
    const { user } = useContext(AuthContext)

    /* useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation]); */

    useEffect(() => {
        const fetchUserCoinValue = async () => {
            try {
                const userId = user.uid;
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
                const userId = user.uid;
                const paymentsSnapshot = await firestore().collection('Payments').where('userId', '==', userId).get();

                const paymentData = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                paymentData.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

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

    const [showGoToTop, setShowGoToTop] = useState(false);
    const scrollViewRef = useRef(null);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Show the "Go to Top" button after scrolling past 200 pixels
        setShowGoToTop(offsetY > 400);
    };

    const scrollToTop = () => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Last 7 days');
    const options = ['Last 7 days', 'Last 30 days'];

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setShowDropdown(false);
    };

    const today = new Date();
    const lastSevenDates = [];
    const lastSevenDatesOG = [];
    const lastSevenDatesMonth = [];
    const lastSevenDatesYear = [];

    const lastThirtyDates = [];
    const lastThirtyDatesOG = [];
    const lastThirtyDatesMonth = [];
    const lastThirtyDatesYear = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        lastSevenDatesOG.push(today.getDate() - i)
        lastSevenDatesMonth.push(date.getMonth())
        lastSevenDatesYear.push(date.getFullYear())
        const formattedDate = (date.getMonth() + 1) + '/' + date.getDate();
        lastSevenDates.push(formattedDate);
    }

    //console.log('lastSevenDatesOG: ',lastSevenDatesOG)

    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        lastThirtyDatesOG.push(date.getDate());
        lastThirtyDatesMonth.push(date.getMonth())
        lastThirtyDatesYear.push(date.getFullYear())
        const formattedDate = (date.getMonth() + 1) + '/' + date.getDate();
        lastThirtyDates.push(formattedDate);
    }

    const [data1, setData1] = useState({
        labels: lastSevenDates,
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    });

    const [data2, setData2] = useState({
        labels: lastThirtyDates,
        datasets: [{ data: Array(30).fill(0) }],
    });

    const renderGraph = () => {
        if (selectedOption === 'Last 7 days') {
            return (
                <ChartStats data={data1} days={'7'} />
            );
        } else if (selectedOption === 'Last 30 days') {
            return (
                <ChartStats data={data2} days={'30'} />
            );
        };
    }

    useEffect(() => {
        const fetchlast7dayshistory = async () => {
            const paymentdata = Array(lastSevenDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastSevenDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastSevenDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('Payments')
                .where('userId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastSevenDatesOG.includes(callDate) && lastSevenDatesMonth.includes(callMonth) && lastSevenDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth] += doc.data().amount;
                }
            });

            lastSevenDatesOG.forEach((date, index) => {
                const key = date + '-' + lastSevenDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    paymentdata[index] = dateIndexMap[key];
                }
            });

            const newData1 = {
                labels: lastSevenDates,
                datasets: [{ data: paymentdata }],
            };
            setData1(newData1);
        };

        const fetchlast30dayshistory = async () => {
            const paymentdata = Array(lastThirtyDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastThirtyDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastThirtyDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('Payments')
                .where('userId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastThirtyDatesOG.includes(callDate) && lastThirtyDatesMonth.includes(callMonth) && lastThirtyDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth] += doc.data().amount;
                }
            });

            lastThirtyDatesOG.forEach((date, index) => {
                const key = date + '-' + lastThirtyDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    paymentdata[index] = dateIndexMap[key];
                }
            });

            const newData2 = {
                labels: lastThirtyDates,
                datasets: [{ data: paymentdata }],
            };
            setData2(newData2);
        };

        fetchlast7dayshistory();
        fetchlast30dayshistory();

    }, [user]);

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]} >
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <AntDesign name='arrowleft' size={25} color={'white'} onPress={() => navigation.goBack()} />
                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 20 }}>Earnings</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('BankDetails')}>
                        <Ionicons name='settings-sharp' size={25} style={{ marginRight: 5 }} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', marginBottom: 10 }}>Account Balance</Text>
                    <Text style={{ fontSize: 36, color: 'white', fontWeight: 'bold' }}>3,40,000
                        <Text style={{ fontSize: 26, color: 'white', fontWeight: 'bold' }}>₹</Text>
                    </Text>
                </View>
            </View>
            <ScrollView ref={scrollViewRef}
                style={{ flex: 1 }}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <View style={[styles.rechargeWithdraw, { backgroundColor: theme.backgroundColor }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.circle1} onPress={handlePurchase}>
                                <AntDesign name='arrowdown' size={35} color={'#658dd8'} />
                            </TouchableOpacity>
                            <Text style={{ color: theme.textColor }}>Recharge</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.circle1}>
                                <AntDesign name='arrowup' size={35} color={'#5bc594'} />
                            </TouchableOpacity>
                            <Text style={{ color: theme.textColor }}>Withdraw</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                        <View style={styles.box1}>
                            <Text style={{ color: Colors.grey, fontWeight: '600' }}>Last Payout</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>3,40,000</Text>
                        </View>
                        <View style={styles.box1}>
                            <Text style={{ color: Colors.grey, fontWeight: '600' }}>Last Payout</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>3,40,000</Text>
                        </View>
                    </View>
                    <View style={styles.stats}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.textColor, marginRight: 5, marginTop: 10 }}>Payment stats</Text>
                            </TouchableOpacity>
                            {/* Dropdown Modal */}
                            <TouchableOpacity onPress={toggleDropdown} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.textColor, marginRight: 5 }}>{selectedOption}</Text>
                                <AntDesign name='caretdown' size={10} color={theme.textColor} />
                            </TouchableOpacity>
                            <Modal
                                visible={showDropdown}
                                animationType="fade"
                                transparent={true}
                                onRequestClose={() => setShowDropdown(false)}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                    onPress={() => setShowDropdown(false)}
                                >
                                    <View style={{ backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
                                        {options.map(option => (
                                            <TouchableOpacity key={option} onPress={() => handleOptionSelect(option)}>
                                                <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', paddingVertical: 5 }}>
                                                    {option}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </View>
                        <View style={styles.chart}>
                            <View>
                                {renderGraph()}
                            </View>
                        </View>
                    </View>
                    <View style={styles.history}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>History</Text>
                            <Entypo name='dots-three-horizontal' size={20} color={'white'} />
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {paymentHistory.length > 0 ? (
                                showAllPayments
                                    ? paymentHistory.map((payment, index) => (
                                        <BalanceHistoryCard key={index} payment={payment} />
                                    ))
                                    : paymentHistory.slice(0, 4).map((payment, index) => (
                                        <BalanceHistoryCard key={index} payment={payment} />
                                    ))
                            ) : (
                                <Text style={styles.noTransactionsText}>No transactions yet</Text>
                            )}
                            <TouchableOpacity style={styles.viewContainer} onPress={toggleShowAllPayments}>
                                {paymentHistory.length > 0 && (
                                    <Text style={styles.viewall}>{showAllPayments ? 'Show Less' : 'View All'}</Text>
                                )}
                            </TouchableOpacity>
                            {showGoToTop && (
                                <TouchableOpacity style={styles.goToTopButton} onPress={scrollToTop}>
                                    <AntDesign name='upcircle' size={30} color={'white'} />
                                    <Text style={{ color: 'white', fontSize: 16 }}>Top</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    goToTopButton: {
        position: 'absolute',
        bottom: 10,
        right: 6,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    goToTopText: {
        fontWeight: 'bold',
        color: 'white',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingBottom: 60
    },
    noTransactionsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#4a3bd2',
        position: 'relative'
    },
    rechargeWithdraw: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 20
    },
    circle1: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: '#e6eefc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box1: {
        height: 100,
        width: 130,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        elevation: 5,
        marginTop: 10
    },
    history: {
        backgroundColor: '#7b71df',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    viewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewall: {
        fontWeight: 'bold',
        color: 'white'
    },
    stats: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    chart: {
        backgroundColor: '#e6effd',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    chartFollowBox: {
        height: 70,
        width: 150,
        backgroundColor: '#4b8089',
        borderRadius: 20,
        marginHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MyBalance1;
