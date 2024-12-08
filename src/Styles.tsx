import { StyleSheet } from 'react-native';

const Colors = {
  primary: '#e91e63',
  bgcolor: 'white',
  topicBgColor: "white",
  bordercolor: '#FFDAB9',
  textColor: "black",
  tobBarColor: "#F67280",
  tabIconDark: "black",
  tabIconLight: "white",
  avatarBorder: '#58e267',
  filterRed: '#00b300',
  timeAgo: "#CCCCCC",
  horLine: "#E5E8EB",
  sheetBack: '#232222',
  startTy: "#636768",
  profileBlack: '#171212',
  profileTag: '#876370',
  profileBorderColor: '#E5DBDE',
  profileBtn1: '#DCD8D9',
  profileBtn2: '#E51A5E',
  light: 'white',
  dark: 'black',
  chatLeftColor: '#383434',
  gray: '#333333',
  grey: 'gray',
  waitingCallsDetails: '#CCCCCC',
  waitingCallsTabIndicator: '#8c8c8c',
  tabTitleOff: '#bfbfbf'
}

const Fonts = {
  regular: 'Poppins-Medium',
  bold: 'Lato-Bold',
  roboto: 'RobotoSlab-Bold'
};
const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.primary,
  },
  shadow: {
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.52,
    shadowRadius: 3,
    elevation: 1,
  }
  // Add more styles as needed
});

export { Colors, Fonts, GlobalStyles };