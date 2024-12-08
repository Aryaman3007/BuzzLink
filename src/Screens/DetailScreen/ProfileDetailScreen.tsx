import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSTANTS } from '../../constants/constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';

interface DropdownItem {
    label: string;
    value: string;
}

const ProfileDetailsScreen = ({ route }) => {
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [email, setEmail] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState(null);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [countries, setCountries] = useState<DropdownItem[]>([]);
    const [states, setStates] = useState<DropdownItem[]>([]);
    const [cities, setCities] = useState<DropdownItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const user = auth().currentUser;
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [coin, setCoin] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [gender, setGender] = useState('');

    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [areStatesAvailable, setAreStatesAvailable] = useState(true);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const renderFilteredLanguages = () => {
        return filteredLanguages.map((language, index) => (
            <Picker.Item key={index} label={language} value={language} />
        ));
    };

    const handleGenderChange = (selectedGender) => {
        setGender(selectedGender);
    };

    const fetchLanguages = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3/all');
            const countriesData = await response.json();

            const languagesSet = new Set();
            countriesData.forEach(country => {
                if (country.languages) {
                    if (typeof country.languages === 'object') {
                        Object.values(country.languages).forEach(language => {
                            languagesSet.add(language);
                        });
                    } else if (typeof country.languages === 'string') {
                        languagesSet.add(country.languages);
                    }
                }
            });

            languagesSet.add('Telugu');
            languagesSet.add('Malayalam');
            languagesSet.add('Kannada');

            const languagesArray = Array.from(languagesSet);
            const sortedLanguagesArray = languagesArray.sort((a, b) => a.localeCompare(b));
            setLanguages(sortedLanguagesArray);
            setFilteredLanguages(sortedLanguagesArray);
            setLoading(false);
            console.log("Languages Array:", sortedLanguagesArray);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
    };

    const showToast = (message) => {
        Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: message,
            visibilityTime: 3000,
            autoHide: true,
        });
    };

    const linkPhoneWithEmailPassword = async () => {
        try {
            const password = await AsyncStorage.getItem('user_password');
            const credential = firebase.auth.EmailAuthProvider.credential(email, password)
            firebase.auth().currentUser?.linkWithCredential(credential)
            console.log('User linked successfully');
        } catch (error) {
            console.error('Error linking phone authentication with email/password:', error);
            showToast('Error linking accounts');
        }
    };

    const handleNext = async () => {
        if (isLoading) {
            return;
        }

        if (!isEmailValid) {
            showToast('Invalid email format');
            return;
        }

        if (email === '' || username === '' || dob === null || country === '') {
            showToast('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);

            const usernameAvailable = isUsernameAvailable;

            if (!usernameAvailable) {
                showToast('Username already exists');
                setIsLoading(false);
                return;
            }

            setCoin(0);

            const selectedLanguagesArray = selectedLanguages.map(language => ({ language }));

            await firestore().collection('users').doc(user.uid).update({
                userId: user.uid,
                phoneNumber: user.phoneNumber,
                email,
                username,
                dob,
                country: countries.find((item) => item.value === country)?.label || '',
                state: states.find((item) => item.value === state)?.label || '',
                city: cities.find((item) => item.value === city)?.label || '',
                postRegisterStep: "LastDetail",
                coin: coin,
                gender: gender,
                languages: selectedLanguagesArray,
            });
            await linkPhoneWithEmailPassword();
            AsyncStorage.setItem(CONSTANTS.PostRegisterStep, "LastDetail")
            navigation.navigate('LastDetail');
        } catch (error) {
            console.error('Error storing user data in Firestore:', error);
            showToast('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkUsernameAvailability = async () => {
            if (username === '') {
                setIsUsernameAvailable(false);
                return;
            }

            try {
                const userDoc = await firestore()
                    .collection('users')
                    .where('username', '==', username)
                    .limit(1)
                    .get();

                const isAvailable = userDoc.empty;
                setIsUsernameAvailable(isAvailable);
            } catch (error) {
                console.error('Error checking username availability:', error);
            }
        };

        checkUsernameAvailability();
    }, [username]);

    useFocusEffect(
        React.useCallback(() => {
            setIsEmailValid(true);
            setEmail('');
            setUsername('');
            setDob(new Date());
            setCountry('');
            setState('');
            setCity('');
            setGender('');
            setSelectedLanguage('');
        }, [])
    );

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const countryData = await firestore().collection('country_data').get();
                const fetchedCountries = countryData.docs.map(doc => ({
                    label: doc.data().name,
                    value: doc.data().id
                }));

                const sortedCountries = fetchedCountries.sort((a, b) => a.label.localeCompare(b.label));

                setCountries(sortedCountries);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        if (country) {
            fetchStates(country);
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            fetchCities(state);
        } else {
            setCities([])
        }
    }, [state]);

    const fetchStates = async (countryId) => {
        console.log("Fetching states for countryId:", countryId);
        const stateData = await firestore().collection('state_data')
            .where('countryId', '==', countryId)
            .get();

        console.log("Fetched States:", stateData.docs);

        if (stateData.docs.length > 0) {
            const statesArray = stateData.docs[0].data().states;
            setStates(statesArray.map(state => {
                return { label: state.name, value: state.id };
            }));
        } else {
            setStates([]);
        }
    };


    const fetchCities = async (stateId) => {
        console.log("Fetching cities for stateId:", stateId);
        const numericStateId = parseInt(stateId);
        console.log("Converted stateId to number:", numericStateId);

        try {
            const cityData = await firestore().collection('city_data')
                .where('stateId', '==', numericStateId)
                .get();

            console.log("City Data Fetched:", cityData.docs);

            if (cityData.docs.length === 0) {
                console.log("No cities found for stateId:", numericStateId);
                setCities([]);
                return;
            }

            const citiesArray = cityData.docs[0].data().cities.map(city => {
                if (city.id && !isNaN(city.id)) {
                    return { label: city.name, value: city.id.toString() };
                }
                return null;
            }).filter(city => city !== null);

            console.log("Processed Cities Array:", citiesArray);
            setCities(citiesArray);
        } catch (error) {
            console.error("Error fetching cities:", error);
            setCities([]);
        }
    };


    if (loading) {
        return (
            <SafeAreaView style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.log("A date has been picked: ", date);
        setDob(date);
        hideDatePicker();
    };

    const renderDateText = () => {
        if (dob) {
            return dob.toDateString();
        }
        return "Select Date of Birth";
    };

    const addSelectedLanguage = (language) => {
        if (!selectedLanguages.includes(language)) {
            setSelectedLanguages([...selectedLanguages, language]);
        }
    };

    const removeSelectedLanguage = (index) => {
        const updatedLanguages = [...selectedLanguages];
        updatedLanguages.splice(index, 1);
        setSelectedLanguages(updatedLanguages);
    };


    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView>
                <ScrollView>
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
                            <View style={[styles.stepCircle, styles.activeStep]}>
                                <Text style={[styles.stepText, styles.activeStepText]}>3</Text>
                            </View>
                            <View style={[styles.stepCircle, styles.inactiveStep]}>
                                <Text style={styles.stepText}>4</Text>
                            </View>
                        </View>
                        <View style={{ width: 20 }} />
                    </View>

                    <Text style={styles.title}>Profile Details</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setEmail(text);
                                validateEmail(text);
                            }}
                            value={email}
                            placeholder="email"
                            placeholderTextColor="grey"
                        />

                        {!isEmailValid && email !== '' && (
                            <Ionicons
                                name="close-circle"
                                size={24}
                                color="red"
                                style={styles.errorIcon}
                            />
                        )}

                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                            placeholder="username"
                            placeholderTextColor="grey"
                        />

                        {username !== '' && (
                            <Text style={isUsernameAvailable ? styles.availableText : styles.unavailableText}>
                                {isUsernameAvailable ? 'Username is available' : 'Username already exists'}
                            </Text>
                        )}
                    </View>


                    <TouchableOpacity
                        style={styles.input}
                        onPress={showDatePicker}>
                        <Text style={styles.dateText}>{renderDateText()}</Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 16))}
                    />


                    <Picker
                        style={styles.input}
                        selectedValue={country}
                        onValueChange={(itemValue, itemIndex) => {
                            setCountry(itemValue);
                            fetchStates(itemValue);
                        }}>
                        <Picker.Item label="Select a country" value="" />
                        {countries.map((c, index) => (
                            <Picker.Item key={index} label={c.label} value={c.value} />
                        ))}
                    </Picker>

                    {states.length > 0 && (
                        <Picker
                            style={styles.input}
                            selectedValue={state}
                            onValueChange={(itemValue, itemIndex) => {
                                setState(itemValue);
                                fetchCities(itemValue);
                            }}>
                            <Picker.Item label="Select a state" value="" />
                            {states.map((s, index) => (
                                <Picker.Item key={index} label={s.label} value={s.value} />
                            ))}
                        </Picker>
                    )}

                    {cities.length > 0 && (
                        <Picker
                            style={styles.input}
                            selectedValue={city}
                            onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
                            enabled={!!state && cities.length > 0}>
                            <Picker.Item label="Select a city" value="" />
                            {cities.map((c, index) => (
                                <Picker.Item key={index} label={c.label} value={c.value} />
                            ))}
                        </Picker>
                    )}


                    <View style={styles.selectedLanguagesContainer}>
                        {selectedLanguages.map((selectedLanguage, index) => (
                            <View style={styles.selectedLanguageContainer} key={index}>
                                <Text style={styles.selectedLanguageText}>{selectedLanguage}</Text>
                                <TouchableOpacity onPress={() => removeSelectedLanguage(index)}>
                                    <Ionicons name="close-circle" size={20} color="red" style={styles.removeLanguageIcon} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>


                    <Picker
                        style={styles.input}
                        selectedValue={null}
                        onValueChange={(itemValue) => addSelectedLanguage(itemValue)}
                        prompt="Select languages"
                        mode="dropdown"
                        enabled={filteredLanguages.length > 0}
                    >
                        <Picker.Item label="Select a language" value="" />
                        {renderFilteredLanguages()}
                    </Picker>

                    <Picker
                        style={styles.input}
                        selectedValue={gender}
                        onValueChange={(itemValue, itemIndex) => handleGenderChange(itemValue)}
                    >
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                        <Picker.Item label="Prefer not to say" value="not" />
                    </Picker>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.curvedButton}
                            onPress={handleNext}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
                            ) : (
                                <Text style={styles.buttonText}>NEXT</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
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
        marginBottom: 20,
        marginLeft: 20,
        marginTop: '20%'
    },
    input: {
        height: 50,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 18,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    curvedButton: {
        marginTop: '10%',
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
    inputContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    errorIcon: {
        position: 'absolute',
        right: 30,
        top: '35%',
        transform: [{ translateY: -12 }],
    },
    dateText: {
        fontSize: 15,
        color: 'black',
    },
    availableText: {
        fontSize: 15,
        marginLeft: 25,
        marginTop: -5,
        color: 'green',
    },
    unavailableText: {
        fontSize: 15,
        color: 'red',
        marginLeft: 25,
        marginTop: -5,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    selectedLanguageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        margin: 5,
        marginStart: 20,
    },
    selectedLanguagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    selectedLanguageText: {
        marginRight: 10,
    },
    removeLanguageIcon: {
        marginLeft: 'auto',
    },
});

export default ProfileDetailsScreen;