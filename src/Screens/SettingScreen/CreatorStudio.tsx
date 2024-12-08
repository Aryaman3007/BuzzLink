import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useContext, useState, useEffect } from 'react'
import { Colors } from '../../Styles'
import { ThemeContext } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthProvider'
import { useCurrentUser } from '../../context/UserContext'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker'
import { LineChart } from 'react-native-chart-kit'
import firestore from '@react-native-firebase/firestore'
import ChartStats from '../../components/ChartStats'

export default function CreatorStudio() {

    const { isDarkMode } = useContext(ThemeContext)
    const navigation = useNavigation()
    const currentUser = useCurrentUser()
    const { user } = useContext(AuthContext)

    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);
    const [selectedOption1, setSelectedOption1] = useState('Call Stats');
    const [selectedOption2, setSelectedOption2] = useState('Last 7 days');
    const options1 = ['Call Stats', 'Earning Stats', 'Requests Stats'];
    const options2 = ['Last 7 days', 'Last 30 days'];
    const [last7DaysEarning, setLast7DaysEarning] = useState(0)
    const [next7DaysEarning, setNext7DaysEarning] = useState(0)
    const [prevDateEarning, setPrevDateEarning] = useState(0)
    const [todayFollowers, setTodayFollowers] = useState(0)
    const [followersCount, setFollowersCount] = useState(0)
    const [todayCalls, setTodayCalls] = useState(0);
    const [todayEarnings, setTodayEarnings] = useState(0);
    const [todayRequests, setTodayRequests] = useState(0);

    const toggleDropdown1 = () => {
        setShowDropdown1(!showDropdown1);
    };

    const toggleDropdown2 = () => {
        setShowDropdown2(!showDropdown2);
    };

    const handleOptionSelect1 = (option) => {
        setSelectedOption1(option);
        setShowDropdown1(false);
    };

    const handleOptionSelect2 = (option) => {
        setSelectedOption2(option);
        setShowDropdown2(false);
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

    const next7daysDates = [];
    const next7daysMonths = [];
    const next7daysYear = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        lastSevenDatesOG.push(date.getDate())
        lastSevenDatesMonth.push(date.getMonth())
        lastSevenDatesYear.push(date.getFullYear())
        const formattedDate = (date.getMonth() + 1) + '/' + date.getDate();
        lastSevenDates.push(formattedDate);
    }

    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        lastThirtyDatesOG.push(date.getDate());
        lastThirtyDatesMonth.push(date.getMonth())
        lastThirtyDatesYear.push(date.getFullYear())
        const formattedDate = (date.getMonth() + 1) + '/' + date.getDate();
        lastThirtyDates.push(formattedDate);
    }

    for (let i = 13; i >= 7; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        next7daysDates.push(date.getDate());
        next7daysMonths.push(date.getMonth());
        next7daysYear.push(date.getFullYear());
    }

    const prevDate = lastSevenDatesOG[5];
    const prevDateMonth = lastSevenDatesMonth[5];
    const prevDateYear = lastSevenDatesYear[5];

    const [data1, setData1] = useState({
        labels: lastSevenDates,
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    });

    const [data2, setData2] = useState({
        labels: lastThirtyDates,
        datasets: [{ data: Array(30).fill(0) }],
    });

    const [data3, setData3] = useState({
        labels: lastSevenDates,
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    });

    const [data4, setData4] = useState({
        labels: lastThirtyDates,
        datasets: [{ data: Array(30).fill(0) }],
    });

    const [data5, setData5] = useState({
        labels: lastThirtyDates,
        datasets: [{ data: Array(30).fill(0) }],
    });

    const [data6, setData6] = useState({
        labels: lastSevenDates,
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    });

    useEffect(() => {
        const fetchLastSevenCallCounts = async () => {
            const callsData = Array(lastSevenDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastSevenDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastSevenDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('influencerCalls')
                .where('userId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastSevenDatesOG.includes(callDate) && lastSevenDatesMonth.includes(callMonth) && lastSevenDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth]++;
                }
            });

            lastSevenDatesOG.forEach((date, index) => {
                const key = date + '-' + lastSevenDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    callsData[index] = dateIndexMap[key];
                }
            });

            const newData1 = {
                labels: lastSevenDates,
                datasets: [{ data: callsData }],
            };
            setData1(newData1);
        };

        const fetchLastThirtyCallCounts = async () => {
            const callsData = Array(lastThirtyDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastThirtyDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastThirtyDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('influencerCalls')
                .where('userId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastThirtyDatesOG.includes(callDate) && lastThirtyDatesMonth.includes(callMonth) && lastThirtyDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth]++;
                }
            });

            lastThirtyDatesOG.forEach((date, index) => {
                const key = date + '-' + lastThirtyDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    callsData[index] = dateIndexMap[key];
                }
            });

            const newData2 = {
                labels: lastThirtyDates,
                datasets: [{ data: callsData }],
            };
            setData2(newData2);
        };

        const fetchLastSevenEarningsCounts = async () => {
            const earningsdata = Array(lastSevenDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastSevenDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastSevenDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('earnings')
                .where('userId', '==', user.uid)
                .get();

            let sevenDaysEarnings = 0;
            let lastDateEarning = 0;
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastSevenDatesOG.includes(callDate) && lastSevenDatesMonth.includes(callMonth) && lastSevenDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth] += doc.data().cpm;
                    sevenDaysEarnings += doc.data().cpm
                    if (callDate == prevDate && callMonth == prevDateMonth && callYear == prevDateYear) {
                        lastDateEarning += doc.data().cpm
                    }
                }
            });
            lastSevenDatesOG.forEach((date, index) => {
                const key = date + '-' + lastSevenDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    earningsdata[index] = dateIndexMap[key];
                }
            });
            setPrevDateEarning(lastDateEarning)
            setLast7DaysEarning(sevenDaysEarnings);
            const newData3 = {
                labels: lastSevenDates,
                datasets: [{ data: earningsdata }],
            };
            setData3(newData3);
        };

        const fetchLastThirtyEarningsCounts = async () => {
            const earningdata = Array(lastThirtyDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastThirtyDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastThirtyDatesMonth[index]] = 0;
            });
            let nextSevendaysEarnings = 0;
            const querySnapshot = await firestore()
                .collection('earnings')
                .where('userId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastThirtyDatesOG.includes(callDate) && lastThirtyDatesMonth.includes(callMonth) && lastThirtyDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth] += doc.data().cpm;
                    if (next7daysDates.includes(callDate) && next7daysMonths.includes(callMonth) && next7daysYear.includes(callYear)) {
                        nextSevendaysEarnings += doc.data().cpm;
                    }
                }

            });
            setNext7DaysEarning(nextSevendaysEarnings);
            lastThirtyDatesOG.forEach((date, index) => {
                const key = date + '-' + lastThirtyDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    earningdata[index] = dateIndexMap[key];
                }
            });

            const newData4 = {
                labels: lastThirtyDates,
                datasets: [{ data: earningdata }],
            };
            setData4(newData4);
        };

        const fetchLastSevenRequestsCounts = async () => {
            const requestsdata = Array(lastSevenDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastSevenDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastSevenDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('requests')
                .where('influencerId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastSevenDatesOG.includes(callDate) && lastSevenDatesMonth.includes(callMonth) && lastSevenDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth]++;
                }
            });

            lastSevenDatesOG.forEach((date, index) => {
                const key = date + '-' + lastSevenDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    requestsdata[index] = dateIndexMap[key];
                }
            });

            const newData5 = {
                labels: lastSevenDates,
                datasets: [{ data: requestsdata }],
            };
            setData5(newData5);
        };

        const fetchLastThirtyRequestsCounts = async () => {
            const requestsdata = Array(lastThirtyDatesOG.length).fill(0);
            const dateIndexMap = {};
            lastThirtyDatesOG.forEach((date, index) => {
                dateIndexMap[date + '-' + lastThirtyDatesMonth[index]] = 0;
            });
            const querySnapshot = await firestore()
                .collection('requests')
                .where('influencerId', '==', user.uid)
                .get();
            querySnapshot.forEach((doc) => {
                const callDate = Number(doc.data().date);
                const callMonth = Number(doc.data().month);
                const callYear = Number(doc.data().year);
                if (lastThirtyDatesOG.includes(callDate) && lastThirtyDatesMonth.includes(callMonth) && lastThirtyDatesYear.includes(callYear)) {
                    dateIndexMap[callDate + '-' + callMonth]++;
                }
            });

            lastThirtyDatesOG.forEach((date, index) => {
                const key = date + '-' + lastThirtyDatesMonth[index];
                if (dateIndexMap.hasOwnProperty(key)) {
                    requestsdata[index] = dateIndexMap[key];
                }
            });

            const newData6 = {
                labels: lastThirtyDates,
                datasets: [{ data: requestsdata }],
            };
            setData6(newData6);
        };

        fetchLastSevenCallCounts();
        fetchLastSevenEarningsCounts();
        fetchLastThirtyCallCounts();
        fetchLastThirtyEarningsCounts();
        fetchLastSevenRequestsCounts();
        fetchLastThirtyRequestsCounts();

    }, [user]);

    useEffect(() => {
        const fetchTodayFollowers = async () => {
            const today = new Date();
            const querySnapshot = await firestore()
                .collection('profileData')
                .where('follower', '==', user.uid)
                .where('date', '==', today.getDate())
                .where('month', '==', today.getMonth())
                .where('year', '==', today.getFullYear())
                .get();

            const todayFollowersCount = querySnapshot.size;
            setTodayFollowers(todayFollowersCount)
        };

        const fetchTotalFollowers = async () => {
            const querySnapshot = await firestore()
                .collection('profileData')
                .where('follower', '==', user.uid)
                .get();

            const totalFollowersCount = querySnapshot.size;
            setFollowersCount(totalFollowersCount);
        }

        fetchTotalFollowers();
        fetchTodayFollowers();
    }), [user]

    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation]);

    useEffect(() => {
        const fetchTodayCalls = async () => {
            const querySnapshot = await firestore()
                .collection('influencerCalls')
                .where('userId', '==', user.uid)
                .where('date', '==', today.getDate())
                .get();

            setTodayCalls(querySnapshot.size);
        };

        const fetchTodayEarnings = async () => {
            const querySnapshot = await firestore()
                .collection('earnings')
                .where('userId', '==', user.uid)
                .where('date', '==', today.getDate())
                .get();

            let totalEarnings = 0;
            querySnapshot.forEach((doc) => {
                totalEarnings = totalEarnings + Number(doc.data().cpm)
            });

            setTodayEarnings(totalEarnings);
        };

        const fetchTodayRequests = async () => {
            const querySnapshot = await firestore()
                .collection('requests')
                .where('influencerId', '==', user.uid)
                .where('date', '==', today.getDate())
                .get();

            setTodayRequests(querySnapshot.size);
        };

        fetchTodayCalls();
        fetchTodayEarnings();
        fetchTodayRequests();
    }, [user]);

    const renderGraph = () => {
        if (selectedOption1 === 'Call Stats' && selectedOption2 === 'Last 7 days') {
            return (
                <ChartStats data={data1} days={'7'} />
            );
        } else if (selectedOption1 === 'Call Stats' && selectedOption2 === 'Last 30 days') {
            return (
                <ChartStats data={data2} days={'30'} />
            );
        } else if (selectedOption1 === 'Earning Stats' && selectedOption2 === 'Last 7 days') {
            return (
                <ChartStats data={data3} days={'7'} />

            );
        } else if (selectedOption1 === 'Earning Stats' && selectedOption2 === 'Last 30 days') {
            return (
                <ChartStats data={data4} days={'30'} />
            );
        } else if (selectedOption1 === 'Requests Stats' && selectedOption2 === 'Last 7 days') {
            return (
                <ChartStats data={data5} days={'7'} />
            );
        } else if (selectedOption1 === 'Requests Stats' && selectedOption2 === 'Last 30 days') {
            return (
                <ChartStats data={data6} days={'30'} />
            );
        }
    };

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

    const theme = isDarkMode ? darkTheme : lightTheme;

    const [last7daysPercent, setLast7daysPercent] = useState(0)
    const [lastDatePercent, setLastDatePercent] = useState(0)

    useEffect(() => {
        const fetchTodayPercent = () => {
            if (todayEarnings === prevDateEarning) {
                setLastDatePercent(0);
            }
            else if (prevDateEarning !== 0 && todayEarnings !== 0) {
                const change = (((todayEarnings - prevDateEarning) / prevDateEarning) * 100).toFixed(1);
                setLastDatePercent(change);
            } else if (prevDateEarning === 0) {
                setLastDatePercent(100 * todayEarnings)
            } else if (todayEarnings === 0) {
                setLastDatePercent(-100 * prevDateEarning)
            }
        }

        const fetchLast7daysPercent = () => {

            if (last7DaysEarning === next7DaysEarning) {
                setLast7daysPercent(0);
            }
            else if (next7DaysEarning !== 0 && last7DaysEarning !== 0) {
                const change1 = (((last7DaysEarning - next7DaysEarning) / next7DaysEarning) * 100).toFixed(1);
                setLast7daysPercent(change1);
            } else if (next7DaysEarning === 0) {
                setLast7daysPercent(100 * last7DaysEarning)
            } else if (last7DaysEarning === 0) {
                setLast7daysPercent(-100 * next7DaysEarning)
            }
        }

        fetchTodayPercent();
        fetchLast7daysPercent();
    }, [])

    /*     if (prevDateEarning !== 0) {
            lastDatePercent = (((todayEarnings - prevDateEarning) / prevDateEarning) * 100).toFixed(1);
        } else {
            lastDatePercent = 100;
        } */

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='arrowleft' size={25} color={'white'} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 20 }}>Studio</Text>
            </View>
            <View style={styles.content1}>
                <View style={styles.content1Left}>
                    <Text style={{ color: Colors.gray, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Earnings</Text>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: Colors.gray, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Today</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                            <Text style={{ color: Colors.dark, fontSize: 20, fontWeight: 'bold' }}>{todayEarnings}
                                <Text style={{ fontSize: 14 }}>₹</Text>
                            </Text>
                            <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                {lastDatePercent > 0 ? (
                                    <Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                        <Text style={{ fontSize: 16 }}>↑</Text>{Math.abs(lastDatePercent)}%
                                    </Text>
                                ) : (
                                    <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                        <Text style={{ fontSize: 16 }}>↓</Text>{Math.abs(lastDatePercent)}%
                                    </Text>
                                )}
                            </Text>
                        </View>
                        <Text style={{ color: Colors.gray, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Last 7 days</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: Colors.dark, fontSize: 20, fontWeight: 'bold' }}>{last7DaysEarning}
                                <Text style={{ fontSize: 14 }}>₹</Text>
                            </Text>
                            {last7daysPercent > 0 ? (
                                <Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 16 }}>↑</Text>{Math.abs(last7daysPercent)}%
                                </Text>
                            ) : (
                                <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 16 }}>↓</Text>{Math.abs(last7daysPercent)}%
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.content1Right}>
                    <View style={styles.content1RightBox}>
                        <Text style={{ color: Colors.gray, fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Earnings</Text>
                        <Text style={{ color: Colors.dark, fontSize: 20, fontWeight: 'bold' }}>{todayEarnings}
                            <Text style={{ fontSize: 14 }}>₹</Text>
                        </Text>
                    </View>
                    <View style={styles.content1RightBox}>
                        <Text style={{ color: Colors.gray, fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ratings</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: Colors.dark, fontSize: 20, fontWeight: 'bold' }}>4.8
                                <Text style={{ fontSize: 14 }}>/5.0</Text>
                            </Text>
                            <Text style={{ color: Colors.profileBtn2, fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>
                                <Text style={{ fontSize: 16 }}>↓</Text> 2.3%
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.content2}>
                <TouchableOpacity style={{ width: '30%' }} onPress={() => navigation.navigate('Requests')}>
                    <LinearGradient
                        colors={['#1b3039', '#233d49']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={{ paddingVertical: 15, paddingLeft: 10, borderRadius: 10 }}>
                        <Text style={{ color: '#acb7b9', fontSize: 15, fontWeight: 'bold', marginBottom: 15 }}>Requests</Text>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{todayRequests}</Text>
                        <Text style={{ color: '#a6e4cb', fontSize: 12, fontWeight: 'bold' }}>
                            <Text style={{ fontSize: 16 }}>↑</Text> 2.3%
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                <LinearGradient
                    colors={['#1b3039', '#233d49']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.8, y: 0 }}
                    style={styles.content2Box}>
                    <Text style={{ color: '#acb7b9', fontSize: 15, fontWeight: 'bold', marginBottom: 15 }}>Leaderboard</Text>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>#201</Text>
                    <Text style={{ color: '#a6e4cb', fontSize: 12, fontWeight: 'bold' }}>
                        <Text style={{ fontSize: 16 }}>↑</Text> 2.3%
                    </Text>
                </LinearGradient>
                <LinearGradient
                    colors={['#1b3039', '#233d49']}
                    start={{ x: 0, y: 0 }}            // Start point of the gradient
                    end={{ x: 0.8, y: 0 }}
                    style={styles.content2Box}>
                    <Text style={{ color: '#acb7b9', fontSize: 15, fontWeight: 'bold', marginBottom: 15 }}>Calls</Text>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{todayCalls}</Text>
                    <Text style={{ color: '#a6e4cb', fontSize: 12, fontWeight: 'bold' }}>
                        <Text style={{ fontSize: 16 }}>↑</Text> 2.3%
                    </Text>
                </LinearGradient>
            </View>
            {/* <View style={{ backgroundColor: '#e6effd', height: 60, marginHorizontal: 15, marginVertical: 5, borderRadius: 25 }}></View> */}
            <View style={styles.stats}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={toggleDropdown1} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', marginRight: 5 }}>{selectedOption1}</Text>
                        <AntDesign name='caretdown' size={10} color={'white'} />
                    </TouchableOpacity>
                    {/* Dropdown Modal */}
                    <Modal
                        visible={showDropdown1}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setShowDropdown1(false)}
                    >
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
                            onPress={() => setShowDropdown1(false)}
                        >
                            <View style={{ backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
                                {options1.map(option => (
                                    <TouchableOpacity key={option} onPress={() => handleOptionSelect1(option)}>
                                        <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', paddingVertical: 5 }}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    <TouchableOpacity onPress={toggleDropdown2} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', marginRight: 5 }}>{selectedOption2}</Text>
                        <AntDesign name='caretdown' size={10} color={'white'} />
                    </TouchableOpacity>
                    <Modal
                        visible={showDropdown2}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setShowDropdown2(false)}
                    >
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
                            onPress={() => setShowDropdown2(false)}
                        >
                            <View style={{ backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
                                {options2.map(option => (
                                    <TouchableOpacity key={option} onPress={() => handleOptionSelect2(option)}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                        <View style={styles.chartFollowBox}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Total Followers</Text>
                            <Text style={{ fontWeight: '600', fontSize: 24, color: 'white' }}>{followersCount}</Text>
                        </View>
                        <View style={styles.chartFollowBox}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>New Followers</Text>
                            <Text style={{ fontWeight: '600', fontSize: 24, color: 'white' }}>{todayFollowers}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#3a3c55',
        paddingBottom: 15
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    content1: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    content1Left: {
        paddingVertical: 25,
        paddingLeft: 15,
        backgroundColor: '#e6effd',
        width: '48%',
        borderRadius: 15,
    },
    content1Right: {
        width: '48%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    content1RightBox: {
        backgroundColor: '#e6effd',
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: 15,
    },
    content2: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 10
    },
    content2Box: {
        width: '30%',
        paddingVertical: 15,
        paddingLeft: 15,
        borderRadius: 10,
    },
    stats: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    chart: {
        height: 280,
        backgroundColor: '#e6effd',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 5
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
})