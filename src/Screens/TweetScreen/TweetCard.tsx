import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Colors, Fonts } from '../../Styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';
import { useCurrentUser } from '../../context/UserContext'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import FullScreenImageModal from './FullScreenImageModal';
import storage from '@react-native-firebase/storage'

const TweetCard: React.FC = () => {
    const [inputHeight, setInputHeight] = useState(40);
    const [topicText, setTopicText] = useState('');
    const [userId, setUserId] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const currentUser = useCurrentUser()
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [imageData, setImageData] = useState(null)

    // const openGallery = async() => {
    //     const result = await launchImageLibrary({mediaType: 'photo'});
    //     //setImageData(result?.assets[0]?.uri);
    //     console.log(result)
    // }

    // useEffect(() => {
    //     navigation.getParent()?.setOptions({
    //       tabBarStyle: {
    //         display: "none"
    //       }
    //     });
    //     return () => navigation.getParent()?.setOptions({
    //       tabBarStyle: undefined
    //     });
    //   }, [navigation]);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            quality: 1.0
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            setUserId(user.uid);
        }
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        setCharCount(topicText.length);
    }, [topicText]);

    const handleSubmit = async () => {
        if (topicText.trim() === '') {
            Alert.alert('Please enter a topic');
            return;
        }

        if (!userId) {
            Alert.alert('No user ID found', 'Please login to submit a topic.');
            return;
        }

        try {
            navigation.goBack();
            setLoading(true);
            let imageDownloadUrl = null;
            if (selectedImage) {
                const imageRef = storage().ref().child(`images/${userId}/${Date.now()}.jpg`);
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                await imageRef.put(blob);
                imageDownloadUrl = await imageRef.getDownloadURL();
            }

            // Extract hashtags from the topic text
            const hashtags = topicText.match(/#\w+/g) || []; // Regular expression to match words starting with '#'
            const cleanHashtags = hashtags.map(tag => tag.substring(1));

            // Store topic data in Firestore
            const newTopicRef = firebase.firestore().collection('Topics').doc();
            await newTopicRef.set({
                topicId: newTopicRef.id,
                userId: userId,
                topicText: topicText,
                imageDownloadUrl: imageDownloadUrl,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userName: currentUser?.username,
                hashtags: cleanHashtags  // Add the extracted hashtags to the document
            });

            setLoading(false);
            setTopicText('');
            setSelectedImage(null);
        } catch (error) {
            console.error("Error submitting topic: ", error);
            setLoading(false);
            Alert.alert('Error submitting topic');
        }
    };


    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.loadingColor} />
                </View>
            )}
            <View style={styles.container1}>
                <TouchableOpacity style={styles.xMarkContainer} onPress={() => navigation.goBack()}>
                    <Icon name='times' size={30} color={theme.iconColor} />
                </TouchableOpacity>
                <Text style={[styles.sttext, { color: theme.textColor }]}>Start Topic</Text>
                <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
                    <Text style={[styles.Potext, { color: theme.textColor }]}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.container2, { backgroundColor: theme.container2Background, height: inputHeight + 300 }]}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={{ uri: 'https://png.pngtree.com/thumb_back/fw800/background/20230516/pngtree-avatar-of-a-man-wearing-sunglasses-image_2569096.jpg' }}
                            style={styles.profileImage}
                        />
                        {selectedImage && (
                            <TouchableOpacity style={styles.imageContainer} onPress={toggleModal}>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{ flex: 1, width: 300, height: 200 }}
                                />
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedImage(null)}>
                                    <AntDesign name='closecircle' size={22} color={'white'} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                        <FullScreenImageModal
                            visible={isModalVisible}
                            imageUri={selectedImage}
                            onClose={toggleModal}
                        />
                    </View>
                    <TextInput
                        ref={inputRef}
                        keyboardShouldPersistTaps={true}
                        style={[styles.input, { color: theme.textColor, backgroundColor: theme.inputBackground, height: inputHeight }]}
                        textAlignVertical="top"
                        placeholder="Write something..."
                        placeholderTextColor={theme.placeholderColor}
                        value={topicText}
                        maxLength={250}
                        onChangeText={setTopicText}
                        multiline
                        onContentSizeChange={(event) => {
                            setInputHeight(event.nativeEvent.contentSize.height);
                        }}
                    />
                </View>
                <TouchableOpacity onPress={openImagePicker}>
                    <Text style={{ color: theme.textColor }}>Upload Image</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container3}>
                <Text style={[styles.limit, { color: theme.textColor }]}>Character Limit</Text>
                <Text style={[styles.percentage, { color: theme.textColor }]}>{((charCount / 250) * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View>
                    <View style={[
                        styles.progressBar,
                        {
                            width: `${(charCount / 250) * 100}%`,
                            backgroundColor: theme.progressBarColor,
                            borderColor: theme.progressBarBorderColor
                        }
                    ]} />
                </View>
            </View>

            <Text style={[styles.txtLimit, { color: theme.textColor }]}>{charCount}/250</Text>
        </View>
    );
};

const lightTheme = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    inputBackground: '#fff',
    placeholderColor: '#a9a9a9',
    progressBarColor: '#00ff00',
    loadingColor: Colors.startTy,
    iconColor: '#8c7373',
    progressBarBorderColor: '#000000',
};

const darkTheme = {
    backgroundColor: '#000000',
    textColor: '#ffffff',
    inputBackground: '#333333',
    placeholderColor: '#808080',
    progressBarColor: '#00ff00',
    loadingColor: Colors.startTy,
    iconColor: '#8c7373',
    container2Background: '#333333',
    progressBarBorderColor: '#ffffff',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        flexDirection: 'column'
    },
    container1: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container2: {
        flexDirection: 'column',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 20,
        margin: 10,
        maxHeight: 700,
        borderWidth: 0.5,
        borderColor: '#808080',
        justifyContent: 'space-between'
    },
    imageContainer: {
        height: 200
    },
    cancelButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
        borderRadius: 5,
    },
    container3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sttext: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    Potext: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 60,
        borderWidth: 1,
        margin: 5,
    },
    inputContainer: {
        borderRadius: 12,
        margin: 0,
        alignItems: 'center',
        height: 140,
        borderWidth: 1
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    limit: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    percentage: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    progressBarContainer: {
        height: 10,
        borderRadius: 5,
        margin: 20,
        marginTop: 15,
        marginBottom: 5,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    txtLimit: {
        margin: 25,
        marginTop: 10,
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 9999,
    },
});

export default TweetCard;
