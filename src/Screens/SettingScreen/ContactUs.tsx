import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Alert, ActivityIndicator, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ContactUs: React.FC = () => {
    const navigation = useNavigation();
    const phoneNumber = '1234567890';
    const emailAddress = 'abc@gmail.com';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

    const handleCallUs = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmailUs = () => {
        Linking.openURL(`mailto:${emailAddress}`);
    };

    const handleSend = async () => {
        try {
            setLoading(true);
            const user = auth().currentUser;
            if (!user) {
                Alert.alert('Authentication Required', 'Please login to send a complaint.');
                setLoading(false);
                return;
            }

            if (!name || !email || !message) {
                throw new Error('Please fill all fields.');
            }

            const complaint = {
                name,
                email,
                message,
                userId: user.uid,
                createdAt: firestore.FieldValue.serverTimestamp(),
            };

            const docRef = await firestore().collection('Complaints').add(complaint);
            console.log('Complaint added with ID: ', docRef.id);

            setName('');
            setEmail('');
            setMessage('');

            Alert.alert('Complaint Submitted', 'Your complaint has been submitted successfully.');
        } catch (error) {
            console.error('Error submitting complaint: ', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme; // Define styles based on the current theme

    return (
        <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.containerMain}>
                <View style={styles.navBar}>
                    <TouchableOpacity style={[styles.iconWrapper, { backgroundColor: theme.iconWrapperBackground }]} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color={theme.iconColor} />
                    </TouchableOpacity>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.ContactText}>
                            <Text style={[styles.stepText, { color: theme.textColor }]}>Contact Us</Text>
                        </View>
                    </View>
                    <View style={{ width: 20 }} />
                </View>
                <View style={styles.container}>
                    <View style={styles.container1}>
                        <Image style={styles.image} source={require('../../assets/contact.png')} />
                    </View>
                </View>
                <View>
                    <View style={styles.container2}>
                        <TouchableOpacity style={[styles.container12, { backgroundColor: theme.iconWrapperBackground }]} onPress={handleCallUs}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.callButtonColor }]}>
                                <Ionicons name="call" size={20} color={theme.callButtonIconColor} />
                            </View>
                            <Text style={[styles.text1, { color: theme.callButtonTextColor }]}>Call Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.container13, { backgroundColor: theme.iconWrapperBackground }]} onPress={handleEmailUs}>
                            <View style={[styles.iconContainer1, { backgroundColor: theme.emailButtonColor }]}>
                                <Ionicons name="chatbox-ellipses-outline" size={20} color={theme.emailButtonIconColor} />
                            </View>
                            <Text style={[styles.text2, { color: theme.emailButtonTextColor }]}>Email Us</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.container3, { backgroundColor: theme.iconWrapperBackground }]}>
                    <Text style={[styles.quick, { color: theme.textColor }]}>QUICK CONTACT</Text>
                    <View style={styles.container132}>
                        <Text style={[styles.heading, { color: theme.textColor }]}>Name*</Text>
                        <TextInput
                            style={[styles.EditContainer, { paddingLeft: 20, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                            placeholder='Enter Full Name here'
                            placeholderTextColor={theme.placeholderColor}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.container133}>
                        <Text style={[styles.heading, { color: theme.textColor }]}>Email*</Text>
                        <TextInput
                            style={[styles.EditContainer, { paddingLeft: 20, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                            placeholder='Enter Email Address'
                            placeholderTextColor={theme.placeholderColor}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.container133}>
                        <Text style={[styles.heading, { color: theme.textColor }]}>Message*</Text>
                        <TextInput
                            style={[styles.EditContainer1, { paddingLeft: 20, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                            placeholder='Enter Your Query'
                            placeholderTextColor={theme.placeholderColor}
                            textAlignVertical="top"
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>
                    <View style={styles.container4}>
                        <TouchableOpacity style={[styles.send, { backgroundColor: theme.sendButtonColor }]} onPress={handleSend}>
                            <Text style={[styles.sendTxt, { color: theme.sendButtonTextColor }]}>Send</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </ScrollView>
    );
};

const lightTheme = {
    backgroundColor: 'white',
    iconColor: 'black',
    textColor: 'black',
    callButtonColor: '#66ff33',
    callButtonIconColor: 'orange',
    callButtonTextColor: 'black',
    emailButtonColor: '#3399ff',
    emailButtonIconColor: 'blue',
    emailButtonTextColor: 'black',
    inputBackgroundColor: '#fff',
    placeholderColor: '#339966',
    sendButtonColor: '#86b300',
    sendButtonTextColor: '#fff',
    iconWrapperBackground: '#ffffff',
};

const darkTheme = {
    backgroundColor: '#000',
    iconColor: 'white',
    textColor: 'white',
    callButtonColor: '#66ff33',
    callButtonIconColor: 'orange',
    callButtonTextColor: 'white',
    emailButtonColor: '#3399ff',
    emailButtonIconColor: 'blue',
    emailButtonTextColor: 'white',
    inputBackgroundColor: '#333333',
    placeholderColor: '#339966',
    sendButtonColor: '#86b300',
    sendButtonTextColor: '#fff',
    iconWrapperBackground: '#333333',
};

const styles = StyleSheet.create({
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
        width: 40,
        height: 40,
        alignItems: 'center',
        borderRadius: 5,
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
    stepText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container1: {

        width: 390,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container2: {
        flexDirection: 'row',
        borderRadius: 5,
        marginTop: 20,
        margin: 20,
    },
    container12: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 'auto',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 20,
        width: 100,
        height: 100,
    },
    container13: {
        flexDirection: 'column',
        alignItems: 'center',
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
        borderRadius: 20,
        width: 100,
        height: 100,
    },
    iconContainer: {
        height: 50,
        width: 50,
        backgroundColor: '#66ff33',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    iconContainer1: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3399ff',
        borderRadius: 50,
    },
    text1: {
        textAlign: 'center',
        marginTop: 5,
        fontWeight: 'bold'
    },
    text2: {
        textAlign: 'center',
        marginTop: 5,
        fontWeight: 'bold'
    },
    container3: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '100%',
        width: '100%'
    },
    container133: {
        marginBottom: 20,
        marginStart: 20
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    EditContainer: {
        height: 60,
        width: 370,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    EditContainer1: {
        height: 120,
        width: 370,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    container132: {
        marginTop: 20,
        marginBottom: 20,
        marginStart: 20
    },
    quick: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20
    },
    containerMain: {
        marginBottom: 100,
    },
    send: {
        height: 60,
        width: 300,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        flexDirection: 'row',
    },
    sendTxt: {
        marginEnd: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    container4: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 170,
        width: 350,
    }
});

export default ContactUs;
