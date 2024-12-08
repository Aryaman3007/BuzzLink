import React, { useRef, useEffect,useContext } from 'react';
import { View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../Styles'; 
import { ThemeContext } from '../context/ThemeContext';

const AnimatedIconWrapper = ({ iconSize, gradientColors, iconColor, iconName }) => {
    const animation = useRef(new Animated.Value(0)).current;

    const { isDarkMode } = useContext(ThemeContext);

    const lightTheme = {
        backgroundColor: Colors.light,
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
        borderColor: 'grey',
        bottomSheetBack: 'white'
    };

    const darkTheme = {
        backgroundColor: Colors.profileBlack,
        textColor: Colors.light,
        iconColor: '#666',
        borderColor: 'grey',
        bottomSheetBack: '#333333'
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                easing: Easing.linear,
                duration: 1000,
                useNativeDriver: false, 
            })
        ).start();
    }, [animation]);

    const interpolatedColors = animation.interpolate({
        inputRange: [0, 1],
        outputRange: gradientColors,
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.backgroundColor,
                overflow: 'hidden',
                top: -35,
                borderWidth: 2,
                borderColor: interpolatedColors,
                justifyContent: 'center',
                alignItems: 'center', 
            }}
        >
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </Animated.View>
    );
};

export default AnimatedIconWrapper;
