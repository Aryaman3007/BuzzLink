import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const QrCode = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = auth().currentUser;
            setCurrentUser(user);

            if (user) {
                const userDoc = await firestore().collection('users').doc(user.uid).get();
                setUserData(userDoc.data());
            }

            setLoading(false);
        };

        fetchCurrentUser();
    }, []);

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.container1}>
                <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
                    <Image style={styles.back} source={isDarkMode ? require('../../assets/backWhite.png') : require('../../assets/bak.png')} />
                </TouchableOpacity>
                <View style={styles.centerContainer}>
                    <Text style={[styles.code, { color: theme.textColor }]}>QR Code</Text>
                </View>
            </View>
            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color={theme.activityIndicatorColor} />
            ) : (
                <>
                    <View style={styles.container2}>
                        <Image style={styles.profile} source={require('../../assets/avatar2.png')} />
                        <Text style={[styles.username, { color: theme.textColor }]}>{userData ? userData.username : 'Username'}</Text>
                        <Text style={[styles.userId, { color: theme.secondaryTextColor }]}>@{currentUser ? currentUser.email : 'username'}</Text>
                    </View>
                    <View style={styles.container3}>
                        <Text style={[styles.qoute, { color: theme.textColor }]}>Your QR Your Profile</Text>
                    </View>
                    <View style={styles.container4}>
                        <View style={[styles.qrContainer, { backgroundColor: theme.qrBackgroundColor }]}>
                            <QRCode
                                value={currentUser ? `${currentUser.uid}\n${userData ? userData.username : 'Username'}` : 'NA'}
                                size={290}
                                color={theme.qrCodeColor}
                                backgroundColor={theme.qrBackgroundColor}
                            />
                        </View>
                    </View>
                    <View style={styles.container5}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}>
                            <Text style={[styles.btnText, { color: theme.buttonTextColor }]}>Share QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const lightTheme = {
    backgroundColor: 'white',
    textColor: '#000000',
    secondaryTextColor: '#4F7396',
    qrCodeColor: 'black',
    qrBackgroundColor: 'white',
    buttonBackgroundColor: '#E8EDF2',
    buttonTextColor: '#000000',
    activityIndicatorColor: '#0000ff',
};

const darkTheme = {
    backgroundColor: '#333333',
    textColor: '#ffffff',
    secondaryTextColor: '#8c7373',
    qrCodeColor: 'white',
    qrBackgroundColor: '#333333',
    buttonBackgroundColor: '#555555',
    buttonTextColor: '#ffffff',
    activityIndicatorColor: '#ffffff',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container1: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backContainer: {},
    back: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    code: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    profile: {
        height: 128,
        width: 128,
        marginTop: 15,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 28,
        marginTop: 15,
    },
    userId: {
        fontSize: 15,
    },
    container3: {
        margin: 20,
    },
    qoute: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold',
    },
    container4: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container5: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 52,
        width: 358,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default QrCode;
