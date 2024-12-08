import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Colors, Fonts } from '../../Styles'
import auth from "@react-native-firebase/auth"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native';
import PasswordScreen from '../DetailScreen/PasswordScreen';
import firestore from '@react-native-firebase/firestore';

const OTPVerify: React.FC = ({ route }) => {
    const navigation = useNavigation();
    const { confirmationResult, phoneNumber } = route.params;
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [setPhoneNumber] = useState('');
    const [resendPressed, setResendPressed] = useState(false);
    const inputRefs = Array.from({ length: 6 }, () => React.createRef<TextInput>());
    const resendLimit = 3;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [timer, resendPressed]);

    useFocusEffect(
        React.useCallback(() => {
            setOtpDigits(['', '', '', '', '', '']);
        }, [])
    );

    const handleOTPVerification = async () => {
        try {
            setIsLoading(true);
            const userCredential = await confirmationResult.confirm(otpDigits.join(''));
            const user = userCredential.user;

            await firestore().collection('users').doc(user.uid).set({
                userId: user.uid,
                phoneNumber: user.phoneNumber,
                postRegisterStep: "PasswordScreen"
            });


            setIsLoading(false)

            if (user) {
                navigation.navigate('PostRegister', { screen: "PasswordScreen" });
            } else {
                console.error('User object is undefined after OTP verification');
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to verify OTP. Please try again.'
                });
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error verifying OTP:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to verify OTP. Please try again.'
            });
        }
    };

    const handleResendOTP = async () => {
        if (resendPressed < resendLimit) {
            try {
                setIsLoading(true);
                const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
                setTimer(60);
                setResendPressed((prevResendPressed) => prevResendPressed + 1);
                Toast.show({
                    type: 'success',
                    text1: 'OTP Resent!',
                    text2: 'An OTP has been resent to your phone number.'
                });
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error resending OTP:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to resend OTP. Please try again.'
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Limit Exceeded',
                text2: 'You have reached the maximum resend attempts.'
            });
        }
    };

    const handleLastDigitInput = () => {
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.stepIndicatorContainer}>
                    <View style={[styles.stepCircle, styles.activeStep]}>
                        <Text style={[styles.stepText, styles.activeStepText]}>1</Text>
                    </View>
                    <View style={[styles.stepCircle, styles.inactiveStep]}>
                        <Text style={styles.stepText}>2</Text>
                    </View>
                    <View style={[styles.stepCircle, styles.inactiveStep]}>
                        <Text style={styles.stepText}>3</Text>
                    </View>
                    <View style={[styles.stepCircle, styles.inactiveStep]}>
                        <Text style={styles.stepText}>4</Text>
                    </View>
                </View>
                <View style={{ width: 20 }} />
            </View>
            <View style={styles.mainContainer}>
                <Text style={styles.verifyText}>OTP Verification</Text>
                <Text style={styles.wewillText}>Enter the code from the SMS we sent to +91 {phoneNumber.slice(-10)}</Text>
                <View style={styles.inputboxContainer}>
                    {otpDigits.map((value, index) => (
                        <TextInput
                            key={index}
                            style={styles.inputBox}
                            maxLength={1}
                            keyboardType="numeric"
                            ref={inputRefs[index]}
                            value={value}
                            onChangeText={(text) => {
                                const newOtpDigits = [...otpDigits];
                                newOtpDigits[index] = text;
                                setOtpDigits(newOtpDigits);
                                if (text !== '' && index < 5) {
                                    inputRefs[index + 1].current?.focus();
                                }
                                if (index === 5 && text !== '') {
                                    handleLastDigitInput();
                                }
                            }}
                            onKeyPress={(event) => {
                                if (event.nativeEvent.key === 'Backspace' && index > 0 && value === '') {
                                    inputRefs[index - 1].current?.focus();
                                }
                            }}
                        />
                    ))}
                </View>
                <View style={styles.termsContainer}>
                    <Text style={styles.term}>Didn't receive the OTP ? </Text>
                    {timer === 0 ? (
                        <TouchableOpacity style={styles.term1} onPress={handleResendOTP}>
                            <Text style={styles.resendText}>RESEND </Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.term}>RESEND in {timer}s</Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.curvedButton}
                    disabled={isLoading}
                    onPress={handleOTPVerification}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
                    ) : (
                        <Text style={styles.buttonText}>NEXT</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        fontFamily: Fonts.regular,
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#fff',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    navText: {
        fontSize: 18,
        color: 'black',
    },
    iconWrapper: {
        width: 30,
        height: 30,
        alignItems: 'center',
        borderRadius: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inactiveStep: {
        backgroundColor: '#D9D4DC',
    },
    activeStep: {
        backgroundColor: 'red',
    },
    stepText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeStepText: {
        color: 'white',
    },
    mainContainer: {
        height: '50%',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    arrowContainer: {
        height: 50,
        width: 50,
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 3,
        backgroundColor: 'white',
        shadowColor: 'black',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    textContainer: {
        flexDirection: 'row',
        marginLeft: 30,
        flex: 1,
    },
    textContainer1: {
        height: 50,
        width: 50,
        marginTop: '1%',
        borderRadius: 50,
        backgroundColor: 'red',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        fontWeight: 'bold',
    },
    termContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer2: {
        height: 50,
        width: 50,
        marginTop: '1%',
        borderRadius: 50,
        backgroundColor: '#D9D4DC',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        fontWeight: 'bold',
    },
    arrow: {
        padding: 15,
    },
    verifyText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#FF0032'
    },
    wewillText: {
        fontWeight: 'bold',
        color: '#616161',
        marginTop: 10
    },
    inputboxContainer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingLeft: 10
    },
    inputBox: {
        width: '10%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: 5,
        color: '#000'
    },
    termsContainer: {
        marginTop: '10%',
        flexDirection: 'row'
    },
    term: {
        fontWeight: 'bold',
        color: '#030303'
    },
    term1: {
        fontWeight: 'bold',
        color: '#FF0032'
    },
    resendText: {
        color: '#FF0032',
        fontWeight: 'bold',
    },
    curvedButton: {
        marginTop: '15%',
        backgroundColor: '#FF0032',
        width: 300,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30%'
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white'
    },
});

export default OTPVerify;