import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSTANTS } from '../../constants/constants';
import LoadingModal from './LoadingModal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';

const LastDetail = ({ route }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const [isFinishing, setIsFinishing] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const toggleDetailsScreen = route.params.toggleDetailsScreen;
    const toggleCheckbox = () => setIsChecked(!isChecked);

    /* const handleDocumentPick = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setSelectedFile(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User canceled the picker
            } else {
                console.error('Error picking document: ', err);
            }
        }
    }; */

    const handleFinishPress = async () => {

        setIsFinishing(true);
        setLoadingVisible(true);

        try {
            const user = auth().currentUser;

            if (user) {
                /*// Upload the file to Firebase Storage
                const storageRef = storage().ref(`userDocuments/${user.uid}/${selectedFile.name}`);
                await storageRef.putFile(selectedFile.uri);
 
                // Update Firestore with the document URL
                const downloadURL = await storageRef.getDownloadURL();*/
                await firestore().collection('users').doc(user.uid).update({
                    //documentURL: downloadURL,
                    postRegisterStep: "HomeScreen"
                });

                await AsyncStorage.setItem(CONSTANTS.PostRegisterStep, "Home");
                toggleDetailsScreen();
            } else {
                // Handle the case where there is no logged-in user
            }
        } catch (error) {
            console.error("Failed to update Firestore: ", error);
        } finally {
            setIsFinishing(false);
            setLoadingVisible(false);
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
                    <View style={[styles.stepCircle, styles.inactiveStep]}>
                        <Text style={styles.stepText}>2</Text>
                    </View>
                    <View style={[styles.stepCircle, styles.inactiveStep]}>
                        <Text style={styles.stepText}>3</Text>
                    </View>
                    <View style={[styles.stepCircle, styles.activeStep]}>
                        <Text style={[styles.stepText, styles.activeStepText]}>4</Text>
                    </View>
                </View>
                <View style={{ width: 20 }} />
            </View>
            {/* <View style={styles.importContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
                    <Text style={styles.uploadButtonText}>Upload Document</Text>
                </TouchableOpacity>
                {selectedFile && <Text>{selectedFile.name}</Text>}
    </View> */}
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={toggleCheckbox}>
                    <Ionicons
                        name={isChecked ? "checkbox" : "square-outline"}
                        size={24}
                        color={isChecked ? "red" : "black"}
                    />
                    <Text style={styles.checkboxLabel}>By checking this icon, you are accepting</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.curvedButton, !isChecked && styles.buttonDisabled]}
                    onPress={handleFinishPress}
                    disabled={!isChecked || isFinishing}
                >
                    {isFinishing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>FINISH!</Text>
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
    importContainer: {

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
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    curvedButton: {
        marginTop: 20,
        backgroundColor: '#FF0032',
        width: 200,
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
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        color: '#030303',
        marginLeft: 10,
        fontSize: 16,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    uploadButton: {
        backgroundColor: '#FF0032',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default LastDetail;