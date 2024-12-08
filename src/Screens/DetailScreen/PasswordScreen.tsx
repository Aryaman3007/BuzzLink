import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSTANTS } from '../../constants/constants';
import * as bcrypt from 'react-native-bcrypt';

const PasswordScreen = ({ route }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
    const navigation = useNavigation();
    const user = auth().currentUser;
    const [isLoading, setIsLoading] = useState(false);

    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);


    const togglePasswordVisibility = () => {
        setIsPasswordHidden(!isPasswordHidden);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
    };

    const clearFields = () => {
        setPassword('');
        setConfirmPassword('');
        setHasMinLength(false);
        setHasUppercase(false);
        setHasLowercase(false);
        setHasSpecialChar(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            clearFields();
            setPasswordsMatch(false);
        }, [])
    );

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    useEffect(() => {
        return () => {
            setPasswordsMatch(false);
        };
    }, []);

    const validatePassword = (password) => {
        setHasMinLength(password.length >= 8);
        setHasUppercase(/[A-Z]/.test(password));
        setHasLowercase(/[a-z]/.test(password));
        setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    };

    const handleConfirmPasswordChange = (confirmPassword) => {
        setConfirmPassword(confirmPassword);
        if (password.length > 0 && confirmPassword.length > 0) {
            setPasswordsMatch(password === confirmPassword);
        } else {
            setPasswordsMatch(false);
        }
    };


    const CriteriaIndicator = ({ isMet, text }) => {
        return (
            <View style={styles.criteriaContainer}>
                <Ionicons
                    name={isMet ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={isMet ? 'green' : 'red'}
                />
                <Text style={styles.criteriaText}>{text}</Text>
            </View>
        );
    };

    const handleNext = async () => {
        if (isLoading) {
            return;
        }

        if (password.length === 0 || confirmPassword.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password and confirm password cannot be empty.'
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match',
                text2: 'Please make sure the passwords match.'
            });
            return;
        }

        if (!hasMinLength || !hasUppercase || !hasLowercase || !hasSpecialChar) {
            Toast.show({
                type: 'error',
                text1: 'Password requirements not met',
                text2: 'Please check the password requirements.'
            });
            return;
        }

        if (password === confirmPassword) {
            try {
                setIsLoading(true);
                bcrypt.hash(password, 10, async (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        Toast.show({
                            type: 'error',
                            text1: 'Failed to hash password',
                            text2: 'Please try again.'
                        });
                        setIsLoading(false);
                        return;
                    }
                    try {
                        await AsyncStorage.setItem('user_password', password);
                        await firestore().collection('users').doc(user.uid).update({
                            userId: user.uid,
                            phoneNumber: user.phoneNumber,
                            password: hashedPassword,
                            postRegisterStep: "ProfileDetailScreen"
                        });
                        AsyncStorage.setItem(CONSTANTS.PostRegisterStep, "ProfileDetailScreen");
                        navigation.navigate('ProfileDetailScreen');
                    } catch (error) {
                        console.error('Error storing password in Firestore:', error);
                        Toast.show({
                            type: 'error',
                            text1: 'Failed to store password',
                            text2: 'Please try again.'
                        });
                    } finally {
                        setIsLoading(false);
                    }
                });
            } catch (error) {
                console.error('Error hashing password:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to hash password',
                    text2: 'Please try again.'
                });
                setIsLoading(false);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match.'
            });
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.stepIndicatorContainer}>
                    <View style={[styles.stepCircle, styles.inactiveStep]}>
                        <Text style={styles.stepText}>1</Text>
                    </View>
                    <View style={[styles.stepCircle, styles.activeStep]}>
                        <Text style={[styles.stepText, styles.activeStepText]}>2</Text>
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

            <Text style={styles.title}>Set a password</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Enter a password"
                    secureTextEntry={isPasswordHidden}
                    placeholderTextColor="grey"
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={togglePasswordVisibility}
                >
                    <Ionicons
                        name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="grey"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={handleConfirmPasswordChange}
                    value={confirmPassword}
                    placeholder="Re-enter password"
                    secureTextEntry={isConfirmPasswordHidden}
                    placeholderTextColor="grey"
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={toggleConfirmPasswordVisibility}
                >
                    <Ionicons
                        name={isConfirmPasswordHidden ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="grey"
                    />
                </TouchableOpacity>
            </View>

            <View>
                <CriteriaIndicator isMet={hasMinLength} text="At least 8 characters" />
                <CriteriaIndicator isMet={hasUppercase} text="Contains an uppercase letter" />
                <CriteriaIndicator isMet={hasLowercase} text="Contains a lowercase letter" />
                <CriteriaIndicator isMet={hasSpecialChar} text="Contains a special character" />
                <View style={styles.criteriaContainer}>
                    <Ionicons
                        name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                        size={20}
                        color={passwordsMatch ? 'green' : 'red'}
                    />
                    <Text style={styles.criteriaText}>
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.curvedButton}
                    onPress={handleNext}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
                    ) : (
                        <Text style={styles.buttonText}>NEXT</Text>
                    )}
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    title: {
        fontSize: 28,
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 25,
        marginLeft: 20,
        marginTop: '20%'
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    input: {
        height: 50,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderRadius: 5,
        marginHorizontal: 20,
        paddingHorizontal: 40,
        fontSize: 18,
        shadowColor: '#000',
        color: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    eyeIcon: {
        position: 'absolute',
        top: '50%',
        right: 30,
        transform: [{ translateY: -12 }],
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    curvedButton: {
        marginTop: '15%',
        backgroundColor: '#FF0032',
        width: 250,
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
    criteriaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    criteriaText: {
        marginLeft: 10,
    }
});

export default PasswordScreen;
