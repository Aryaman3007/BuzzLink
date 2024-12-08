import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../Styles';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const ConnectScreen = () => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext); // Get the current theme mode

  const theme = isDarkMode ? darkTheme : lightTheme; // Define styles based on the current theme

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View>
        <View style={styles.findMatchContainer}>
          <TouchableOpacity
            style={[styles.findMatchButton, { backgroundColor: theme.buttonColor }]}
            onPress={() => {
              setIsButtonLoading(!isButtonLoading);
              try {
                navigation.navigate("MatchingScreen");
              } catch (e) {
                console.log(e);
              }
            }}>
            {isButtonLoading ? (
              <ActivityIndicator size={28} color="#fff" style={styles.spinner} />
            ) : (
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: theme.buttonTextColor }}>
                Find Match
              </Text>
            )}
          </TouchableOpacity>
          <View style={{ position: 'absolute', right: -25 }}>
            <Icon name="tune" size={35} color={theme.iconColor} />
          </View>
        </View>
        <View style={styles.ruleContainer}>
          <Text style={[styles.ruleText, { color: theme.textColor }]}>Rules</Text>
          <Text style={[styles.ruleText, { color: theme.textColor }]}>1. point one</Text>
          <Text style={[styles.ruleText, { color: theme.textColor }]}>2. point two</Text>
          <Text style={[styles.ruleText, { color: theme.textColor }]}>3. point three</Text>
          <Text style={[styles.ruleText, { color: theme.textColor }]}>4. point four</Text>
          <Text style={[styles.ruleText, { color: theme.textColor }]}>5. point five</Text>
        </View>
      </View>
    </View>
  );
};

const lightTheme = {
  backgroundColor: Colors.bgcolor,
  buttonColor: '#FF0032',
  buttonTextColor: 'white',
  textColor: 'black',
  iconColor: 'gray',
};

const darkTheme = {
  backgroundColor: '#333333',
  buttonColor: '#FF0032',
  buttonTextColor: 'white',
  textColor: 'white',
  iconColor: 'gray',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  findMatchButton: {
    width: 200,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  findMatchContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruleContainer: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  ruleText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ConnectScreen;
