import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert, PermissionsAndroid, ActivityIndicator } from 'react-native';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import QRCode from 'react-native-qrcode-svg';
import firestore from '@react-native-firebase/firestore';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ThemeContext } from '../../context/ThemeContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const EditScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        gender: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [editModes, setEditModes] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        username: false,
        gender: false
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userId = auth().currentUser.uid;
                const userDoc = await firestore().collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setUserData(userData);
                } else {
                    console.log("User document does not exist");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const saveUserData = async () => {
        try {
            setLoading(true);
            const userId = auth().currentUser.uid;
            await firestore().collection('users').doc(userId).update(userData);
            console.log("User data updated successfully");
        } catch (error) {
            console.error("Error updating user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleEditMode = (field: string) => {
        setEditModes((prevEditModes) => ({
            ...prevEditModes,
            [field]: !prevEditModes[field]
        }));
    };

    const theme = isDarkMode ? darkTheme : lightTheme; // Define styles based on the current theme mode

    return (
        <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.container}>
                <View style={styles.container1}>
                    <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
                        <Image style={styles.image1} source={isDarkMode ? require('../../assets/back2.png') : require('../../assets/back.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.textContainer} onPress={saveUserData}>
                        <Text style={[styles.save, { color: theme.saveTextColor }]}>Save</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container2}>
                    <Text style={[styles.editText, { color: theme.textColor }]}>Edit personal info</Text>
                </View>
                {initialLoading ? (
                    <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }]}>
                        <ActivityIndicator size="large" color={theme.loadingColor} />
                    </View>
                ) : (
                    <>
                        <View style={styles.container3}>
                            <View style={styles.container13}>
                                <Text style={[styles.heading, { color: theme.textColor }]}>First name</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.EditContainer, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                                        placeholder='Current name'
                                        placeholderTextColor={theme.placeholderColor}
                                        defaultValue={userData.firstName}
                                        onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                                        editable={editModes.firstName} />

                                    <TouchableOpacity style={styles.pencil} onPress={() => toggleEditMode('firstName')}>
                                        <FontAwesome
                                            name={editModes.firstName ? 'check' : 'pencil'}
                                            size={20}
                                            color={theme.textColor}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.container13}>
                                <Text style={[styles.heading, { color: theme.textColor }]}>Last name</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.EditContainer, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                                        placeholder='Current name'
                                        placeholderTextColor={theme.placeholderColor}
                                        defaultValue={userData.lastName}
                                        onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                                        editable={editModes.lastName}
                                    />
                                    <TouchableOpacity style={styles.pencil} onPress={() => toggleEditMode('lastName')}>
                                        <FontAwesome
                                            name={editModes.lastName ? 'check' : 'pencil'}
                                            size={20}
                                            color={theme.textColor}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.container13}>
                                <Text style={[styles.heading, { color: theme.textColor }]}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.EditContainer, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                                        placeholder='Current email'
                                        placeholderTextColor={theme.placeholderColor}
                                        defaultValue={userData.email}
                                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                                        editable={editModes.email}
                                    />
                                    <TouchableOpacity style={styles.pencil} onPress={() => toggleEditMode('email')}>
                                        <FontAwesome
                                            name={editModes.email ? 'check' : 'pencil'}
                                            size={20}
                                            color={theme.textColor}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.container13}>
                                <Text style={[styles.heading, { color: theme.textColor }]}>Phone number</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.EditContainer, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                                        placeholder='Current number'
                                        placeholderTextColor={theme.placeholderColor}
                                        defaultValue={userData.phoneNumber}
                                        onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })}
                                        editable={editModes.phoneNumber}
                                    />
                                    <TouchableOpacity style={styles.pencil} onPress={() => toggleEditMode('phoneNumber')}>
                                        <FontAwesome
                                            name={editModes.phoneNumber ? 'check' : 'pencil'}
                                            size={20}
                                            color={theme.textColor}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.container2}>
                            <Text style={[styles.editText, { color: theme.textColor }]}>Emergency contact</Text>
                        </View>
                        <View style={styles.container3}>
                            <View style={styles.container13}>
                                <Text style={[styles.heading, { color: theme.textColor }]}>Username</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.EditContainer, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                                        placeholder='Current Username'
                                        placeholderTextColor={theme.placeholderColor}
                                        defaultValue={userData.username}
                                        onChangeText={(text) => setUserData({ ...userData, username: text })}
                                        editable={editModes.username}
                                    />
                                    <TouchableOpacity style={styles.pencil} onPress={() => toggleEditMode('username')}>
                                        <FontAwesome
                                            name={editModes.username ? 'check' : 'pencil'}
                                            size={20}
                                            color={theme.textColor}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.container13}>
                                <Text style={[styles.heading, { color: theme.textColor }]}>Gender</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.EditContainer, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                                        placeholder='Current Gender'
                                        placeholderTextColor={theme.placeholderColor}
                                        defaultValue={userData.gender}
                                        onChangeText={(text) => setUserData({ ...userData, gender: text })}
                                        editable={editModes.gender}
                                    />
                                    <TouchableOpacity style={styles.pencil} onPress={() => toggleEditMode('gender')}>
                                        <FontAwesome
                                            name={editModes.gender ? 'check' : 'pencil'}
                                            size={20}
                                            color={theme.textColor}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>
            {loading && (
                <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }]}>
                    <ActivityIndicator size="large" color={theme.loadingColor} />
                </View>
            )}
        </ScrollView >
    );
};

const lightTheme = {
    backgroundColor: '#fff',
    textColor: '#000',
    inputBackground: '#ffe6e6',
    placeholderColor: '#fff',
    saveTextColor: '#000',
    loadingColor: '#000',
};

const darkTheme = {
    backgroundColor: '#000000',
    textColor: '#ffffff',
    inputBackground: '#243647',
    placeholderColor: '#fff',
    saveTextColor: '#94ADC7',
    loadingColor: '#94ADC7',
};

const styles = StyleSheet.create({
    scroll: {
        height: '100%',
        width: '100%',
    },
    container: {
        marginBottom: 70,
    },
    container1: {
        flexDirection: 'row',
        margin: 20,
        marginHorizontal: 13,
        alignItems: 'center',
    },
    backContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginEnd: 10,
    },
    save: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    image1: {
        width: 40,
        height: 40,
    },
    container2: {
        margin: 20,
    },
    editText: {
        fontWeight: 'bold',
        fontSize: 23
    },
    container3: {
        marginTop: -20,
        marginBottom: 20,
        marginStart: 20,
        marginEnd: 20,
    },
    heading: {
        fontSize: 16,
        marginBottom: 10,
    },
    EditContainer: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        padding: 20,
    },
    container13: {
        marginTop: 20,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editIcon: {
        position: 'absolute',
        right: 20,
    },
    pencil: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default EditScreen;
