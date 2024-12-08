import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Image, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../context/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../Styles';
import { ThemeContext } from '../../context/ThemeContext';

const SettingScreen: React.FC = () => {
    const navigation = useNavigation();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(true);
    const [userData, setUserData] = useState({ username: '', email: '' });
    const {logout} = useContext(AuthContext)
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const lightTheme = {
        backgroundColor: Colors.light,
        textColor: Colors.profileBlack,
        iconColor: Colors.profileBtn1,
    };

    const darkTheme = {
        backgroundColor: Colors.profileBlack,
        textColor: Colors.light,
        iconColor: '#666',
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    const [loadingUsername, setLoadingUsername] = useState<boolean>(true);

   /*  useEffect(() => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            display: "none"
          }
        });
        return () => navigation.getParent()?.setOptions({
          tabBarStyle: undefined
        });
      }, [navigation]); */

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth().currentUser;
                if (currentUser) {
                    const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
                    if (userDoc.exists) {
                        const { username, email } = userDoc.data();
                        setUserData({ username, email });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoadingUsername(false);
            }
        };

        fetchUserData();
    }, []);

    const navigateToQr = () => {
        navigation.navigate('QrCode');
    };

    const navigateToEdit = () => {
        navigation.navigate('EditScreen');
    };

    const navigateToContact = () => {
        navigation.navigate('ContactUs');
    };

    const navigateToFAQ = () => {
        navigation.navigate('FAQ')
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <ScrollView contentContainerStyle={[styles.container22, { backgroundColor: theme.backgroundColor }]}>
                <View style={styles.container1}>
                    <View style={styles.container11}>
                        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
                            <Ionicons name='arrow-back' size={25} color={theme.textColor} />
                        </TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={[styles.settings, { color: theme.textColor }]}>Settings</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.container12}>
                    <Image style={styles.image} source={require('../../assets/avatar1.png')} />
                    <View style={styles.textContainer1}>
                        {loadingUsername ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <>
                                <Text style={[styles.txt, { color: theme.textColor }]}>{userData.username}</Text>
                                <Text style={styles.txtEmail}>{userData.email}</Text>
                            </>
                        )}
                    </View>
                    <TouchableOpacity style={styles.iconright} onPress={navigateToQr}>
                        <Ionicons name="qr-code-outline" size={24} color={theme === darkTheme ? 'white' : 'black'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container2}>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="share" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Share</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="user" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Profile</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Edit Profile</Text>
                            </View>
                            <TouchableOpacity style={styles.iconright} onPress={navigateToEdit}>
                                <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Save Profile</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="user-plus" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Invite</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="cog" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Account</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Your Activity</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Edit Privacy</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="bell-o" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Notifications</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(newValue) => setIsNotificationsEnabled(newValue)}
                                value={isNotificationsEnabled}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Block')}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="ban" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Blocked List</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="lock" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Security</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Password Reset</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Change Email</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="sliders" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Additional Settings</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Language</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Theme</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleTheme}
                                value={isDarkMode}

                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft}>
                                <View style={styles.backlight}>
                                    <Icon name="question-circle-o" size={20} color="black" />
                                </View>
                                <Text style={[styles.settingText, { color: theme.textColor }]}>Support</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Terms of Service</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Data Policy</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>About</Text>
                            </View>
                            <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Help/FAQ</Text>
                            </View>
                            <TouchableOpacity style={styles.iconright} onPress={navigateToFAQ}>
                                <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem1}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingLeft1}>
                                <Text style={[styles.settingText1, { color: theme.textColor }]}>Contact Us</Text>
                            </View>
                            <TouchableOpacity style={styles.iconright} onPress={navigateToContact}>
                                <Image style={styles.image2} source={theme === darkTheme ? require('../../assets/action.png') : require('../../assets/actionBlack.png')} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity>
                        <Text style={styles.bottomButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomButton} onPress={logout}>
                        <Text style={styles.bottomButtonText1}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container1: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    container11: {
        flexDirection: 'row',
        margin: 20,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    container12: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
    },
    textContainer1: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginStart: 15,
    },
    iconright: {
        marginLeft: 'auto',
    },
    image: {
        height: 56,
        width: 56,
    },
    txt: {
        color: '#121417',
        fontSize: 20,
        fontWeight: 'bold',
    },
    txtEmail: {
        color: '#637587',
        fontSize: 15,
    },
    backContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settings: {
        fontWeight: 'bold',
        fontSize: 24,
        marginEnd: 25,
        color: '#121417',
        textAlign: 'center',
    },
    container2: {
        marginStart: 20,
        marginEnd: 20,
    },
    container22: {
        marginBottom: 20,
    },
    settingItem: {
        marginBottom: 10,
        marginTop: 10,
    },
    settingContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    settingItem1: {
        marginBottom: 10,
        marginTop: 5,
    },
    settingLeft1: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        marginStart: 50,
    },
    settingText: {
        marginLeft: 20,
        fontSize: 18,
        fontWeight: 'bold'
    },
    settingText1: {
        marginLeft: 20,
        fontSize: 14,
        color: '#686363',
        fontWeight: 'bold'
    },
    horizontalLine: {
        borderBottomColor: '#616161',
        borderBottomWidth: 0.5,
        marginTop: 10,
    },
    backlight: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        backgroundColor: '#C2C2C2',
        borderRadius: 5,
    },
    bottomButtonsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    bottomButton: {
        backgroundColor: '#E1E1E1',
        height: 50,
        width: 358,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtonText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 18,
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
    bottomButtonText1: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    image2: {
        height: 30,
        width: 20
    }
});

export default SettingScreen;
