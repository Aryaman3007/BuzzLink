import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors, Fonts } from '../../Styles';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';

const OTPLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    emoji: '🇮🇳',
    phoneCode: '91',
    countryName: 'India',
  });
  const [dropdownPosition, setDropdownPosition] = useState(0);

  useEffect(() => {
    const handleKeyboardDidShow = (e: KeyboardEvent) => {
      setShowDropdown(false);
    };

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardDidShow
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setPhoneNumber('');
    }, [])
  );

  useEffect(() => {
    firestore()
      .collection('country_data')
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            countryName: doc.data().name,
            emoji: doc.data().emoji,
            currencyCode: doc.data().currency,
            phoneCode: doc.data().phone_code,
          });
        });
        setCountryData(data);
      })
      .catch((error) => {
        console.error('Error retrieving country data:', error);
      });

    setSelectedCountry({
      emoji: '🇮🇳',
      phoneCode: '91',
      countryName: 'India',
    });
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry({ ...country, phoneCode: `+${country.phoneCode}` });
    setShowDropdown(false);
  };

  const sortedCountryData = countryData.slice().sort((a, b) => a.countryName.localeCompare(b.countryName));

  const CountryItem = React.memo(({ item, onSelect }) => {
    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => onSelect(item)}
      >
        <Text style={styles.dropdownText}>
          {`${item.emoji} +${item.phoneCode} ${item.countryName}`}
        </Text>
      </TouchableOpacity>
    );
  });

  const handleOTPGeneration = async () => {
    setIsLoading(true);
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+${selectedCountry.phoneCode}${phoneNumber}`;

      console.log('Formatted Phone Number:', formattedPhoneNumber);

      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setConfirmationResult(confirmation);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent!',
        text2: 'An OTP has been sent to your phone number.',
      });
      navigation.navigate('OTPVerify', { confirmationResult: confirmation, phoneNumber: formattedPhoneNumber });
    } catch (error) {
      console.error('Error sending OTP:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send OTP. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.verifyText}>Verify Phone Number</Text>
        <View style={styles.wewillContainer}>
          <Text style={styles.wewillText}>we will send an ONE TIME PASSWORD on this</Text>
          <Text style={styles.wewillText1}>mobile number</Text>
        </View>
        <TouchableOpacity
          style={styles.inputboxContainer}
          onPress={() => setShowDropdown(true)}
        >
          <View style={styles.countryCodeContainer}>
            <Text style={styles.countryEmoji}>
              {selectedCountry.emoji}
            </Text>
            <Text style={styles.phoneCode}>
              {selectedCountry.phoneCode}
            </Text>
          </View>
          <TextInput
            style={styles.inputBox2}
            placeholder="Phone number"
            keyboardType="numeric"
            maxLength={15}
            value={phoneNumber}
            onChangeText={(text) => {
              const sanitizedText = text.startsWith(`+${selectedCountry.phoneCode}`)
                ? text.substring(`+${selectedCountry.phoneCode}`.length)
                : text;

              setPhoneNumber(sanitizedText);
            }}
          />
        </TouchableOpacity>

        <View style={styles.termContainer}>
          <Text style={styles.term}>By Providing my phone number, I hereby agree and</Text>
          <View style={styles.termsContainer}>
            <Text style={styles.term}>accept the </Text>
            <Text style={styles.term1}>Terms of Service </Text>
            <Text style={styles.term}>and </Text>
            <Text style={styles.term1}>Privacy Policy </Text>
            <Text style={styles.term}>in </Text>
          </View>
          <Text style={styles.term}>use of the app.</Text>
        </View>
        <TouchableOpacity style={styles.curvedButton} onPress={handleOTPGeneration} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
          ) : (
            <Text style={styles.buttonText}>NEXT</Text>
          )}
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpButtonText} onPress={() => navigation.navigate('Login')}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={showDropdown}
        onBackdropPress={() => setShowDropdown(false)}
        useNativeDriver={true}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        style={{
          margin: 0,
          justifyContent: 'flex-start',
          top: dropdownPosition,
        }}
      >
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setShowDropdown(false)}
          >
            <FontAwesome name="times" size={20} color="#000" />
          </TouchableOpacity>
          <FlatList
            data={sortedCountryData}
            keyExtractor={(item) => item.id}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            renderItem={({ item }) => (
              <CountryItem item={item} onSelect={handleCountrySelect} />
            )}
          />
        </View>
      </Modal>
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
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  wewillContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wewillText: {
    fontWeight: 'bold',
    color: '#616161',
    marginTop: 10,
  },
  wewillText1: {
    fontWeight: 'bold',
    color: '#616161',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  verifyText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FF0032',
  },
  termContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer2: {
    height: '21%',
    width: '19%',
    marginTop: '1%',
    borderRadius: 50,
    backgroundColor: '#D9D4DC',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginRight: 19,
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
  curvedButton: {
    marginTop: '15%',
    backgroundColor: '#FF0032',
    width: 300,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  inputboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 10,
  },
  staticText: {
    width: '20%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 17,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    backgroundColor: 'white',
    textAlign: 'center',
    color: '#000',
  },
  inputBox2: {
    width: '70%',
    height: '100%',
    marginLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    paddingStart: 15,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  term: {
    fontWeight: 'bold',
    color: '#989898',
  },
  term1: {
    fontWeight: 'bold',
    color: '#FF0032',
  },
  dropdownContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '90%',
    alignSelf: 'center',
    top: '45%',
    overflow: 'hidden',
    maxHeight: '60%',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 20,
    color: '#FF0032',
  },
  closeIconContainer: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 10
  },
  countryCodeContainer: {
    width: '20%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  countryEmoji: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  phoneCode: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    color: '#000', // Assuming a black text color
    fontFamily: Fonts.regular, // Example for Medium weight
  },
  signUpButtonText: {
    fontFamily: Fonts.regular, // Example for Medium weight
    fontWeight: 'bold',
    color: Colors.primary, // Replace with the color of your sign-up text/button
  },
});

export default OTPLogin;
