import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const MessageReport: React.FC = ({targetUserId}) => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionContainer5, setSelectedOptionContainer5] = useState(null);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

    const theme = isDarkMode ? darkTheme : lightTheme; // Define styles based on the current theme

    const handleOptionSelect = (option, container) => {
        if (container === 'container3') {
            setSelectedOption(selectedOption === option ? null : option);
        } else if (container === 'container5') {
            setSelectedOptionContainer5(selectedOptionContainer5 === option ? null : option);
        }
    };

    const handleGoBack = () => {
        navigation.navigate('HomeScreen');
    };

    const getCurrentUserId = () => {
        const currentUser = auth().currentUser;
        if (currentUser) {
            return currentUser.uid;
        } else {
            return null;
        }
    };

    const handleSubmitReport = () => {
        setLoading(true);
        const userId = getCurrentUserId();

        if (!selectedOption || !inputText) {
            Alert.alert('Please fill all fields');
            setLoading(false);
            return;
        }

        firestore()
            .collection('Reports')
            .add({
                userId: userId,
                Reason: selectedOption,
                inputText: inputText,
                BlockUser: selectedOptionContainer5,
            })
            .then(() => {
                console.log('Report submitted successfully!');
                setSelectedOption(null);
                setInputText('');
                setSelectedOptionContainer5(null);
            })
            .catch((error) => {
                console.error('Error submitting report: ', error);
                Alert.alert('An error occurred. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.container1}>
                <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
                    <Image style={styles.profileImage} source={isDarkMode ? require('../../assets/back1.png') : require('../../assets/backk.png')} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={[styles.reportText, { color: theme.textColor }]}>Report or Block</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container2}>
                    <Text style={[styles.why, { color: theme.textColor }]}>Why are you reporting this user?</Text>
                </View>
                <View style={styles.container3}>
                    <TouchableOpacity
                        style={[styles.option1, selectedOption === 'Inappropriate content' && styles.selectedOption, { backgroundColor: theme.backgroundColor, borderColor: theme.textColor }]}
                        onPress={() => handleOptionSelect('Inappropriate content', 'container3')}>
                        <Text style={[styles.optionText, { color: theme.textColor }]}>Inappropriate content</Text>
                        {selectedOption === 'Inappropriate content' && <Icon name="check" style={styles.checkIcon} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.option1, selectedOption === 'Spam' && styles.selectedOption, { backgroundColor: theme.backgroundColor, borderColor: theme.textColor }]}
                        onPress={() => handleOptionSelect('Spam', 'container3')}>
                        <Text style={[styles.optionText, { color: theme.textColor }]}>Spam</Text>
                        {selectedOption === 'Spam' && <Icon name="check" style={styles.checkIcon} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.option1, selectedOption === 'Harassment' && styles.selectedOption, { backgroundColor: theme.backgroundColor, borderColor: theme.textColor }]}
                        onPress={() => handleOptionSelect('Harassment', 'container3')}>
                        <Text style={[styles.optionText, { color: theme.textColor }]}>Harassment</Text>
                        {selectedOption === 'Harassment' && <Icon name="check" style={styles.checkIcon} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.option1, selectedOption === 'Underage user' && styles.selectedOption, { backgroundColor: theme.backgroundColor, borderColor: theme.textColor }]}
                        onPress={() => handleOptionSelect('Underage user', 'container3')}>
                        <Text style={[styles.optionText, { color: theme.textColor }]}>Underage user</Text>
                        {selectedOption === 'Underage user' && <Icon name="check" style={styles.checkIcon} />}
                    </TouchableOpacity>
                </View>
                <View style={styles.container4}>
                    <TextInput
                        style={[styles.inputBox, { color: theme.textColor, borderColor: theme.borderColor }]}
                        placeholder="Please share any details that can help us understand the situation"
                        multiline={true}
                        placeholderTextColor={'#876370'}
                        numberOfLines={4}
                        value={inputText}
                        onChangeText={(text) => setInputText(text)}
                        textAlignVertical="top"
                    />
                </View>
                <View style={styles.container5}>
                    <TouchableOpacity
                        style={[styles.option5, selectedOptionContainer5 === 'Block this user' && styles.selectedOption, { backgroundColor: theme.backgroundColor, borderColor: theme.textColor }]}
                        onPress={() => handleOptionSelect('Block this user', 'container5')}>
                        <Text style={[styles.optionText, { color: theme.textColor }]}>
                            {selectedOptionContainer5 ? 'Dont Block this user' : 'Block this user'}
                        </Text>
                        {selectedOptionContainer5 === 'Block this user' && <View style={styles.selectedDot} />}
                    </TouchableOpacity>
                </View>
                <View style={styles.container6}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                    </TouchableOpacity>
                </View>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const lightTheme = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#bfbfbf',
};

const darkTheme = {
    backgroundColor: '#333333',
    textColor: '#ffffff',
    borderColor: '#707070',
};

const styles = StyleSheet.create({
    scroll: {
        marginBottom: 160,
    },
    container1: {
        flexDirection: 'row',
        margin: 10,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    container2: {
        margin: 10,
        marginHorizontal: 20,
        marginTop: 40,
        marginStart: 20,
    },
    profileImage: {
        height: 45,
        width: 45,
        marginHorizontal: 20,
    },
    reportText: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        marginEnd: 40,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    why: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    container3: {
        alignItems: 'center',
        marginTop: 20,
    },
    option1: {
        backgroundColor: '#fff',
        marginTop: 15,
        height: 65,
        width: 390,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 0.5,
    },
    option5: {
        backgroundColor: '#fff',
        marginTop: 15,
        height: 65,
        width: 390,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 0.5,
    },
    optionText: {
        marginStart: 20,
        fontWeight: 'bold',
    },
    selectedOption: {
        backgroundColor: '#E8F0FE',
    },
    selectedDot: {
        position: 'absolute',
        backgroundColor: 'red',
        width: 10,
        height: 10,
        borderRadius: 5,
        right: 10,
    },
    checkIcon: {
        position: 'absolute',
        color: 'green',
        fontSize: 20,
        right: 10,
    },
    container4: {
        alignItems: 'center',
        marginTop: 30,
    },
    inputBox: {
        height: 190,
        width: 390,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 16,
    },
    container5: {
        alignItems: 'center',
        marginTop: 0,
    },
    container6: {
        alignItems: 'center',
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#E51A5E',
        marginTop: 20,
        width: 358,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default MessageReport;
