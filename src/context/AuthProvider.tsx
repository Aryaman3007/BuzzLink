import React, { createContext, useState, useEffect } from "react";
import auth from '@react-native-firebase/auth'
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from '@react-native-firebase/firestore'
import { CONSTANTS } from "../constants/constants";
import bcrypt from 'react-native-bcrypt';

export const AuthContext = createContext();

let userData = {}

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  const setData = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      Alert.alert('Error storing user data');
    }
  };

  const goToNext = async (name, email, userId) => {
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USERID', userId);
  }

  const getData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('user');

      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        setUser(userData);
      }
    } catch (error) {
      Alert.alert('Error retrieving user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            const response = await auth().signInWithEmailAndPassword(email, password);
            const hashedPassword = await AsyncStorage.getItem('user_password'); // Get the hashed password from AsyncStorage

            // Compare the entered password with the hashed password
            bcrypt.compare(password, hashedPassword, (err, res) => {
              if (err) {
                Alert.alert('Error comparing passwords:', err.message);
                return;
              }
              if (res) {
                // Passwords match, proceed with login
                firestore().collection('users').where('email', '==', email)
                  .get()
                  .then(res => {
                    if (res.docs !== []) {
                      console.log(JSON.stringify(res.docs[0].data()))
                      goToNext(res.docs[0].data().name, res.docs[0].data().email, res.docs[0].data().userId)
                    } else {
                      Alert.alert('User not found')
                    }
                  })
              } else {
                // Passwords don't match, show error message
                Alert.alert('Incorrect password');
              }
            });
          } catch (error) {
            Alert.alert('Error logging in:', error.message);
          }
        },
        signup: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password)
          } catch (error) {
            Alert.alert(error.message)
          }
        },
        logout: async () => {
          try {
            await auth().signOut()
            AsyncStorage.removeItem(CONSTANTS.PostRegisterStep);

          } catch (error) {
            Alert.alert(error.message)
          }
        },
        resetpassword: async (email) => {
          try {
            await auth().sendPasswordResetEmail(email)
          } catch (error) {
            Alert.alert('Error resetting password:', error.message);
          }
        }

      }}>
      {!loading && children}
    </AuthContext.Provider >
  )

}


