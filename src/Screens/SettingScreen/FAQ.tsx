import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert, PermissionsAndroid, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const FAQ: React.FC = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [isAppVisible, setAppVisible] = useState(false);
    const [answersVisibility, setAnswersVisibility] = useState([false, false, false]);
    const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

    const toggleAnswerVisibility = (index: number) => {
        setAnswersVisibility(prevState => {
            const updatedVisibility = [...prevState];
            updatedVisibility[index] = !updatedVisibility[index];
            return updatedVisibility;
        });
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
                            <Text style={[styles.stepText, { color: theme.textColor }]}>Support</Text>
                        </View>
                    </View>
                    <View style={{ width: 20 }} />
                </View>
                <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                    <View style={[styles.searchContainer, { backgroundColor: theme.searchContainerBackground }]}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.text, { color: theme.textColor }]}>Need Some help with front?</Text>
                        </View>
                        <View style={styles.searchBox}>
                            <TextInput
                                style={[styles.searchInput, { color: theme.textColor }]}
                                placeholder="Search Something"
                                placeholderTextColor="#999"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            <TouchableOpacity style={styles.search} onPress={() => { /* Handle search */ }}>
                                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textContainer1}>
                            <Text style={[styles.text1, { color: theme.textColor }]}>Lorem Ipsum is simply dummy text</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.smallContainer}>
                    <View style={styles.smallContainer1}>
                        <TouchableOpacity style={[styles.smallContainer11, { backgroundColor: theme.searchContainerBackground }]}>
                            <View style={[styles.iconContainer1, { backgroundColor: theme.backgroundColor }]}>
                                <Ionicons name="play" size={20} color={theme.iconColor} />
                            </View>
                            <Text style={[styles.text2, { color: theme.textColor }]}>Get Started</Text>
                            <Text style={[styles.text3, { color: theme.textColor }]}>Lorun Ipsum is simply</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallContainer12, { backgroundColor: theme.searchContainerBackground }]}>
                            <View style={[styles.iconContainer1, { backgroundColor: theme.backgroundColor }]}>
                                <Ionicons name="person" size={20} color={theme.iconColor} />
                            </View>
                            <Text style={[styles.text2, { color: theme.textColor }]}>Accounts</Text>
                            <Text style={[styles.text3, { color: theme.textColor }]}>Lorun Ipsum is simply</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.smallContainer2}>
                        <TouchableOpacity style={[styles.smallContainer11, { backgroundColor: theme.searchContainerBackground }]}>
                            <View style={[styles.iconContainer1, { backgroundColor: theme.backgroundColor }]}>
                                <Ionicons name="cash" size={20} color="red" />
                            </View>
                            <Text style={[styles.text2, { color: theme.textColor }]}>Subscription</Text>
                            <Text style={[styles.text3, { color: theme.textColor }]}>Lorun Ipsum is simply</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallContainer12, { backgroundColor: theme.searchContainerBackground }]}>
                            <View style={[styles.iconContainer1, { backgroundColor: theme.backgroundColor }]}>
                                <Ionicons name="information-circle" size={20} color="orange" />
                            </View>
                            <Text style={[styles.text2, { color: theme.textColor }]}>Help</Text>
                            <Text style={[styles.text3, { color: theme.textColor }]}>Lorun Ipsum is simply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[styles.heading, { color: theme.textColor }]}>FREQUENTLY ASKED QUESTIONS</Text>
                <TouchableOpacity style={[styles.expandContainer, { backgroundColor: theme.searchContainerBackground }]}>
                    <TouchableOpacity onPress={() => toggleAnswerVisibility(0)}>
                        <View style={styles.question}>
                            <Text style={[styles.text4, { color: theme.textColor }]}>1. What is Lorem Ipsum?</Text>
                            <Ionicons name={answersVisibility[0] ? 'chevron-up' : 'chevron-down'} size={20} color={theme.iconColor} />
                        </View>
                        {answersVisibility[0] && <View style={styles.hrLine}></View>}
                        {answersVisibility[0] && (
                            <View style={styles.answerContainer}>
                                <Text style={[styles.answer, { color: theme.textColor }]}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.expandContainer, { backgroundColor: theme.searchContainerBackground }]}>
                    <TouchableOpacity onPress={() => toggleAnswerVisibility(1)}>
                        <View style={styles.question}>
                            <Text style={[styles.text4, { color: theme.textColor }]}>2. Why do we use it?</Text>
                            <Ionicons name={answersVisibility[1] ? 'chevron-up' : 'chevron-down'} size={20} color={theme.iconColor} />
                        </View>
                        {answersVisibility[1] && <View style={styles.hrLine}></View>}
                        {answersVisibility[1] && (
                            <View style={styles.answerContainer}>
                                <Text style={[styles.answer, { color: theme.textColor }]}>assLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.expandContainer, { backgroundColor: theme.searchContainerBackground }]}>
                    <TouchableOpacity onPress={() => toggleAnswerVisibility(2)}>
                        <View style={styles.question}>
                            <Text style={[styles.text4, { color: theme.textColor }]}>3. Where does it come from?</Text>
                            <Ionicons name={answersVisibility[2] ? 'chevron-up' : 'chevron-down'} size={20} color={theme.iconColor} />
                        </View>
                        {answersVisibility[2] && <View style={styles.hrLine}></View>}
                        {answersVisibility[2] && (
                            <View style={styles.answerContainer}>
                                <Text style={[styles.answer, { color: theme.textColor }]}>asLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const lightTheme = {
    backgroundColor: 'white',
    textColor: 'black',
    iconColor: 'black',
    searchContainerBackground: 'white',
    iconContainerBackground: 'white',
    iconWrapperBackground: '#ffffff',
};

const darkTheme = {
    backgroundColor: '#000',
    textColor: 'white',
    iconColor: 'white',
    searchContainerBackground: '#333333',
    iconContainerBackground: '#333333',
    iconWrapperBackground: '#333333',
};

const styles = StyleSheet.create({
    containerMain: {
        marginBottom: 100,
    },
    navBar: {
        flexDirection: 'row',
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
        marginStart: 20,
    },
    stepText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        width: 380,
        marginTop: 20,
        borderRadius: 20,
    },
    smallContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    smallContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallContainer11: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        width: 180,
        marginTop: 20,
        borderRadius: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 'auto',
        padding: 20,
    },
    smallContainer12: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        width: 180,
        marginTop: 20,
        borderRadius: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        height: 60,
        width: 330,
        borderRadius: 20,
        paddingHorizontal: 30,
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
    },
    search: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    text1: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 15,
    },
    iconContainer1: {
        height: 40,
        width: 40,
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
        borderRadius: 50,
    },
    text2: {
        textAlign: 'center',
        marginTop: 5,
        fontWeight: 'bold'
    },
    text3: {
        textAlign: 'center',
        marginTop: 5,
        fontWeight: 'bold',
        fontSize: 12,
        color: '#999'
    },
    heading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 20,
    },
    expandContainer: {
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
        padding: 20,
        marginBottom: 5,
        marginEnd: 20,
        marginStart: 20,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    text4: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    answerContainer: {
    },
    answer: {
        color: '#6b6e6c',
        fontWeight: 'bold'
    },
    hrLine: {
        borderBottomColor: '#999',
        borderBottomWidth: 0.3,
        marginVertical: 10,
    },
    question: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default FAQ;
