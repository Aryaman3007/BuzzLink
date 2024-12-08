// ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Function to retrieve the dark mode status from AsyncStorage when the app starts
    const retrieveDarkModeStatus = async () => {
      try {
        const darkModeValue = await AsyncStorage.getItem('darkMode');
        if (darkModeValue !== null) {
          // Convert the retrieved value from string to boolean
          setIsDarkMode(JSON.parse(darkModeValue));
        }
      } catch (error) {
        console.error('Error retrieving darkMode status:', error);
      }
    };
    retrieveDarkModeStatus();
  }, []);

  const toggleTheme = () => {
    // Toggle the state and store it in AsyncStorage
    const newDarkModeValue = !isDarkMode;
    setIsDarkMode(newDarkModeValue);
    storeDarkModeStatus(newDarkModeValue);
  };

  const storeDarkModeStatus = async (isDarkMode) => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error storing darkMode status:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
