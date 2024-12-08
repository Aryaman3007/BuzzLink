import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Colors, Fonts } from '../../Styles'
import { AuthContext } from '../../context/AuthProvider';

function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext)
  const { resetpassword } = useContext(AuthContext)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = () => {
    if (email === "") {
      Alert.alert('Provide Email Id')
    } else {
      resetpassword(email)
    }
  }

  return (
    <View style={styles.container}>
      <View>
      </View>
      <View>
        <TextInput
          placeholder="Email"
          placeholderTextColor={'gray'}
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
        <View>

          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor={'gray'}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
            <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#e91e63" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleResetPassword()}>
          <Text style={styles.forgotPassword}>forgot password ?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => login(email, password)}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.socialLoginItem}>
            <FontAwesome name="facebook" size={20} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialLoginItem}>
            <FontAwesome name="google" size={20} color="#f4126c" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialLoginItem}>
            <FontAwesome name="instagram" size={20} color="#f4126c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signUpButtonText} onPress={() => navigation.navigate('OTPLogin')}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: Fonts.regular, // Example for Medium weight
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.bgcolor, // Assuming a white background
  },
  input: {
    borderRadius: 10,
    height: 40,
    borderWidth: 0.1,
    borderColor: Colors.bordercolor,
    backgroundColor: 'white',
    marginBottom: 15,
    fontFamily: Fonts.regular, // Example for Medium weight
    fontSize: 16,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.52,
    shadowRadius: 3,
    elevation: 1,
    padding: 10,
    color: 'black'
  },
  eyeIcon: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    fontSize: 12,
    color: Colors.primary, // Assuming a black color for the text
    textDecorationLine: 'underline',
  },
  loginButton: {
    height: 35,
    borderColor: Colors.primary, // Replace with the color of your login button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginBottom: 20,
    borderWidth: 2,
    backgroundColor: Colors.primary,
    marginHorizontal: 10,
  },
  loginButtonText: {
    color: 'white', // Assuming a white text color
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.regular, // Example for Medium weight
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 30
  },
  divider: {
    flex: 1,
    height: 2,
    borderRadius: 20,
    backgroundColor: Colors.primary, // Assuming a black divider color
  },
  orText: {
    fontWeight: '700',
    marginHorizontal: 10,
    color: Colors.primary, // Assuming a black text color for the "or"
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 50,
    marginBottom: 20,
    alignContent: 'center',
    alignItems: 'center'
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#000', // Assuming a black text color
    fontFamily: Fonts.regular, // Example for Medium weight
  },
  socialLoginItem: {
    height: 40,
    width: 40,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.52,
    shadowRadius: 3,

    elevation: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  signUpButtonText: {
    fontFamily: Fonts.regular, // Example for Medium weight
    fontWeight: 'bold',
    color: Colors.primary, // Replace with the color of your sign-up text/button
  },
});

export default LoginScreen;

