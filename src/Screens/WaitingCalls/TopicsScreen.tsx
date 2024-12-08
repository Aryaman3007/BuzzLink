import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors, Fonts } from '../../Styles';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';

const TopicsScreen: React.FC<TopicsScreenProps & { postId: string }> = ({ tweet, interestedUsersCount, postId }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);

  const lightTheme = {
    backgroundColor: '#e6ffe6',
    textColor: Colors.profileBlack,
    iconColor: Colors.profileBtn1,
  };

  const darkTheme = {
    backgroundColor: '#262626',
    textColor: Colors.light,
    iconColor: '#262626',
  };

  const imageSource = isDarkMode
    ? require('../../assets/action.png')
    : require('../../assets/actionBlack.png');

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleRightIconPress = () => {
    navigation.navigate('InterestedUsersScreen', { postId });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.container1, { backgroundColor: theme.backgroundColor }]}>
        <Image style={styles.image} source={require('../../assets/chatchat.png')} />
      </View>
      <View style={styles.container12}>
        <Text numberOfLines={1} style={[styles.tweet, { color: theme.textColor }]}>{tweet}</Text>
        <View style={styles.interestContainer}>
          <Image style={styles.image2} source={require('../../assets/group.png')} />
          <Text style={[styles.interestedText, { color: theme.textColor }]}>
            {interestedUsersCount} interested
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleRightIconPress} style={styles.container13}>
        <Image style={styles.image1} source={imageSource} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 5,
  },
  container1: {
    flexDirection: 'column',
    borderRadius: 20,
    padding: 15
  },
  container12: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginStart: 3,
    marginTop: 13,
    width: 250,
    height: 45,
    flexDirection: 'column',
  },
  container13: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  image: {
    borderRadius: 12,
    marginRight: 5,
    height: 48,
    width: 48,
  },
  image1: {
    borderRadius: 12,
    marginRight: 5,
    height: 28,
    width: 28,
  },
  interestedText: {
    fontWeight: '500',
    fontSize: 15
  },
  tweet: {
    fontWeight: 'bold',
    fontSize: 17,
    width: '90%'
  },
  interestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image2: {
    height: 20,
    width: 40,
    marginEnd: 10,
  }
});

export default TopicsScreen;
