import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeContext } from '../../context/ThemeContext';

const CoinBuyCard: React.FC = () => {
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode
    const theme = isDarkMode ? darkTheme : lightTheme;


    return (
        <View>
            <View style={[styles.buyContainer, { backgroundColor: theme.backgroundColor }]}>
                <Text style={styles.tokenCount}>100</Text>
                <Text style={styles.token}>Tokens</Text>
            </View>
            <View style={styles.priceContainer}>
                <FontAwesome name='dollar' size={20} style={styles.dollar} />
                <Text style={styles.priceText}>1.99</Text>
            </View>
            <View style={styles.offerContainer}>
                <Text style={styles.offerText}>25% Off</Text>
            </View>
        </View>
    );
};

const lightTheme = {
    backgroundColor: 'black',
};

const darkTheme = {
    backgroundColor: '#333333',
};

const styles = StyleSheet.create({
    buyContainer: {
        height: 140,
        width: 110,
        backgroundColor: '#000',
        borderRadius: 20,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
    },
    tokenCount: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    token: {
        color: '#808080'
    },
    priceContainer: {
        height: 40,
        width: 108,
        borderRadius: 15,
        backgroundColor: 'rgb(120, 203, 201)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: -15,
        left: 1,
    },
    dollar: {
        color: 'white',
    },
    priceText: {
        fontSize: 20,
        color: 'white',
        marginLeft: 5
    },
    offerContainer: {
        height: 35,
        width: 100,
        backgroundColor: '#FDC907',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 20,
        top: -10,
    },
    offerText: {
        fontSize: 15,
        color: '#957601'
    }
});

export default CoinBuyCard;