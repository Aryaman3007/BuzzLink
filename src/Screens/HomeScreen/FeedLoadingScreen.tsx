import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Easing, Image } from 'react-native';

const FeedLoadingScreen = () => {
    const [loadingProgress, setLoadingProgress] = useState(new Animated.Value(0));
    const [fadeInOut] = useState(new Animated.Value(0));

    useEffect(() => {
        const animateLoading = () => {
            Animated.loop(
                Animated.timing(loadingProgress, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeInOut, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeInOut, {
                        toValue: 0,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateLoading();

        return () => {
            loadingProgress.stopAnimation();
            fadeInOut.stopAnimation();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.loadingOverlay,
                    {
                        opacity: loadingProgress.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.3, 0.7, 0.3],
                        }),
                    },
                ]}
            />
            <Animated.Image
                source={require('../../assets/loading.png')}
                style={[
                    styles.gif,
                    {
                        opacity: fadeInOut,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    gif: {
        width: 650,
        height: 820,
        resizeMode: 'contain',
    },
});

export default FeedLoadingScreen;
