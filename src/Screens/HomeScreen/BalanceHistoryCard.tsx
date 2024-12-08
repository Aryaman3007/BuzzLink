import React, { useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Fonts } from '../../Styles';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

interface Payment {
    timestamp: Date;
    addedCoins: number;
    amount: number;
    status: 'success' | 'failure';
}

const BalanceHistoryCard: React.FC<{ payment: Payment }> = ({ payment }) => {
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

    const theme = isDarkMode ? darkTheme : lightTheme; // Define styles based on the current theme

    return (
        <View>
            <View style={styles.container1}>
                <View style={styles.container11}>
                    <Ionicons
                        name='wallet'
                        size={24}
                        color={'#abdbe3'}
                    />
                </View>
                <View style={styles.container12}>
                    <Text style={styles.stat1}>Tokens added to account</Text>
                    <Text style={styles.stat2}>{payment.timestamp.toDate().toLocaleDateString()}</Text>
                </View>
                <View style={styles.container13}>
                    <Text style={[styles.money1, { color: payment.status === 'success' ? '#4CD964' : '#FF0032' }]}>+ {payment.addedCoins}</Text>
                    <Text style={styles.money2}>{payment.amount}</Text>
                    <Text style={styles.money3}>{payment.status}</Text>
                </View>
            </View>
        </View>
    );
};

const lightTheme = {
    backgroundColor: '#FFFFFF',
    iconBackground: '#FDC705',
    iconColor: '#000000',
    textColor: '#000000',
    subTextColor: '#616161',
    subMain: 'white'
};

const darkTheme = {
    backgroundColor: 'black',
    iconBackground: '#FDC705',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subTextColor: '#CCCCCC',
    subMain: '#333333'
};

const styles = StyleSheet.create({
    container1: {
        backgroundColor: '#4a3bd2',
        flexDirection: 'row',
        marginBottom: 15,
        padding: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    container11: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    container12: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginStart: 12
    },
    container13: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    stat1: {
        margin: 0,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: 'white'
    },
    stat2: {
        margin: 0,
        fontWeight: 'bold',
        color: 'white'
    },
    money1: {
        textAlign: 'center',
        marginEnd: 7,
        fontSize: 17,
        fontWeight: 'bold',
    },
    money2: {
        textAlign: 'center',
        marginEnd: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white'
    },
    money3: {
        textAlign: 'center',
        marginEnd: 8,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 5,
        color: 'white'
    }
});

export default BalanceHistoryCard;
