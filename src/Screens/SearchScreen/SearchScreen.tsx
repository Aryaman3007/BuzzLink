import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, Text, Image, Modal, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect, useContext } from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../../Styles';
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from 'react-native-search-bar'
import { ThemeContext } from '../../context/ThemeContext';


export default function SearchScreen({ navigation }) {

    const [input, setInput] = useState('')
    const [searchResults, setSearchResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isVerified, setIsVerified] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const { isDarkMode } = useContext(ThemeContext);

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

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleStatus = () => {
        setIsOnline(previousState => !previousState);
    };

    const toggleUser = () => {
        setIsVerified(previousState => !previousState);
    };

    const clearInput = () => {
        setInput('');
    };

    const searchUsers = async () => {
        try {
            if (input === '') {
                setSearchResults([]);
            }
            const querySnapshot = await firestore()
                .collection('users')
                .where('username', '>=', input)
                .where('username', '<=', input + '\uf8ff')
                .get();

            const users = querySnapshot.docs.map(doc => doc.data());
            setSearchResults(users);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const popularTags = ['Mandarin', 'Crypto', 'Venture Capital', 'Tech', 'Fintech'];
    const categories = ['Investing', 'Fitness', 'Startups', 'Travel'];

    useEffect(() => {
        if (input.length > 0) {
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [input]);

    useEffect(() => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            display: "none"
          }
        });
        return () => navigation.getParent()?.setOptions({
          tabBarStyle: undefined
        });
      }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header}>
                <AntDesign name='arrowleft' size={25} color={theme.textColor} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 18, color: theme.textColor }}>Search</Text>
                <TouchableOpacity style={styles.filter} onPress={toggleModal}>
                    <FontAwesome name='sliders' size={25} color={theme.textColor} />
                </TouchableOpacity>
            </View>
            <View style={[styles.search, { backgroundColor: theme.iconColor }]}>
                <EvilIcons name='search' size={30} color={theme.textColor} />
                <TextInput
                    style={[styles.searchText, { color: theme.textColor }]}
                    underlineColorAndroid={'transparent'}
                    onChangeText={setInput}
                    placeholder='Search Influencers, Users'
                    placeholderTextColor={theme.textColor}
                />
                {input.length > 0 && (
                    <TouchableOpacity onPress={clearInput} style={{ marginLeft: 'auto', paddingRight: 5 }}>
                        <AntDesign name='closecircleo' size={20} color={theme.textColor} />
                    </TouchableOpacity>
                )}
            </View>
            {input.length === 0 && (
                <>
                    <Text style={{ fontSize: 20, color: theme.textColor, fontWeight: '600', marginLeft: 15, marginTop: 20 }}>Popular tags</Text>
                    <View style={styles.popularTag}>
                        {popularTags.map((tag, index) => (
                            <TouchableOpacity key={index} style={[styles.popularTagBtns, { backgroundColor: theme.iconColor }]}>
                                <Text style={{ color: theme.textColor }}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={{ fontSize: 20, color: theme.textColor, fontWeight: '600', marginLeft: 15, marginTop: 20 }}>Categories</Text>
                    <View style={styles.popularTag}>
                        {categories.map((tag, index) => (
                            <TouchableOpacity key={index} style={[styles.popularTagBtns, { backgroundColor: theme.iconColor }]}>
                                <Text style={{ color: theme.textColor }}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 22, marginLeft: 125, fontWeight: 'bold', color: '#4d4d4d' }}>Set Filters</Text>
                            <TouchableOpacity onPress={toggleModal}>
                                <AntDesign name='closecircle' size={22} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{ fontSize: 18, color: '#808080', marginTop: 25, fontWeight: 'bold' }}>Status</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity style={[styles.toggleButton1, isOnline ? styles.selectedButton1 : null]} onPress={() => toggleStatus(true)}>
                                    <Text style={[styles.toggleText1, isOnline ? { color: Colors.light } : { color: 'black' }]}>Online</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.toggleButton2, !isOnline ? styles.selectedButton2 : null]} onPress={() => toggleStatus(false)}>
                                    <Text style={[styles.toggleText1, !isOnline ? { color: Colors.light } : { color: 'black' }]}>Offline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: 18, color: '#808080', fontWeight: 'bold' }}>User</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity style={[styles.toggleButton3, isVerified ? styles.selectedButton3 : null]} onPress={() => toggleUser(true)}>
                                    <Text style={[styles.toggleText2, isVerified ? { color: Colors.light } : { color: 'black' }]}>Verified</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.toggleButton4, !isVerified ? styles.selectedButton4 : null]} onPress={() => toggleUser(false)}>
                                    <Text style={[styles.toggleText2, !isVerified ? { color: Colors.light } : { color: 'black' }]}>Unverified</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: 18, color: '#808080', fontWeight: 'bold' }}>Sort By</Text>
                            <Picker
                                selectedValue={selectedOption}
                                onValueChange={(itemValue) => setSelectedOption(itemValue)}
                                style={{ height: 30, width: '100%', backgroundColor: '#f0f0f0', marginTop: 15 }}
                            >
                                <Picker.Item label="High Coins" value="high" />
                                <Picker.Item label="Low Coins" value="low" />
                            </Picker>
                        </View>
                        <View style={{ marginTop: 45 }}>
                            <Text style={{ fontSize: 18, color: '#808080', fontWeight: 'bold' }}>Social Platform</Text>
                            <View style={styles.filterContainer}>
                                {['All', 'Instagram', 'Twitter', 'Youtube', 'Facebook'].map((filter) => (
                                    <TouchableOpacity
                                        key={filter}
                                        style={[
                                            styles.filterButton,
                                            activeFilter === filter && styles.activeFilterButton
                                        ]}
                                        onPress={() => setActiveFilter(filter)}
                                    >
                                        <Text style={[
                                            styles.filterText,
                                            activeFilter === filter && styles.activeFilterText
                                        ]}>
                                            {filter}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.applyFilterBtn}>
                            <Text style={{ color: Colors.light, fontSize: 18, fontWeight: '600' }}>Apply Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <FlatList
                data={searchResults}
                renderItem={({ item, index }) => {
                    return (
                        <View style={[styles.searchCard, { backgroundColor: theme.backgroundColor }]} key={index}>
                            <View style={styles.left}>
                                <Image source={require('../../assets/avatar.jpg')} style={styles.avatar} />
                            </View>
                            <View style={styles.middle}>
                                <View>
                                    <Text style={{ fontSize: 16, color: theme.textColor, fontWeight: '500' }}>{item.username}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Entypo name='dot-single' size={20} color={'#008b00'} style={{ left: -4 }} />
                                        <Text style={{ fontSize: 13, color: '#008b00', left: -7 }}>available</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                                        <Text style={{ fontSize: 13, color: theme.textColor }}>50</Text>
                                        <Image style={{ height: 26, width: 26 }} source={require('../../assets/Coins.png')} />
                                        <Text style={{ fontSize: 13, color: theme.textColor }}>/min</Text>
                                    </View>
                                </View>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '35%' }}>
                                    <FontAwesom name='facebook' size={18} color={Colors.light} />
                                    <Entypo name='youtube' size={18} color={Colors.light} />
                                    <Entypo name='instagram-with-circle' size={18} color={Colors.light} />
                                </View> */}
                            </View>
                            <View style={styles.right}>
                                <View style={styles.rating}>
                                    <Text style={{ fontSize: 13, marginRight: 5, color: theme.textColor }}>4.2</Text>
                                    <FontAwesome name='star-half-empty' size={15} color={'#fecc01'} />
                                </View>
                                <TouchableOpacity>
                                    <MaterialIcons name='add-call' size={25} color={'#008b00'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
                keyExtractor={(item) => item.userId}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.dark
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    search: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 5,
        backgroundColor: Colors.gray,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 15,
        marginBottom: 5
    },
    searchText: {
        fontSize: 16,
        justifyContent: 'center',
        color: Colors.light,
    },
    filter: {
        width: '10%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    searchCard: {
        // height: 110,
        flexDirection: 'row',
        paddingHorizontal: 5,
        marginBottom: 2,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray'
    },
    left: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    middle: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        marginLeft: 0
    },
    right: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#58e267'
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: Colors.light,
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '80%',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '60%'
    },
    toggleButton1: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderWidth: 0.5,
        borderRightWidth: 0
    },
    toggleButton2: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderWidth: 0.5,
        borderLeftWidth: 0
    },
    toggleButton3: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderWidth: 0.5,
        borderRightWidth: 0
    },
    toggleButton4: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderWidth: 0.5,
        borderLeftWidth: 0
    },
    selectedButton1: {
        backgroundColor: '#00b300',
    },
    selectedButton2: {
        backgroundColor: '#ff3333',
    },
    selectedButton3: {
        backgroundColor: '#00b300',
    },
    selectedButton4: {
        backgroundColor: '#ff3333',
    },
    toggleText1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light,
    },
    toggleText2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light,
    },
    dropdownContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#808080',
        flexDirection: 'row',
    },
    dropdownItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#808080',
    },
    selectedItem: {
        backgroundColor: '#4d4d4d',
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap'
    },
    filterButton: {
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        backgroundColor: Colors.light,
        marginTop: 15
    },
    activeFilterButton: {
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        backgroundColor: Colors.primary,
    },
    filterText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18
    },
    activeFilterText: {
        color: Colors.light,
        fontSize: 18
    },
    applyFilterBtn: {
        width: '100%',
        height: 50,
        backgroundColor: '#4d4d4d',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70
    },
    popularTag: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 15
    },
    popularTagBtns: {
        padding: 10,
        backgroundColor: Colors.gray,
        borderRadius: 10,
        marginRight: 10,
        marginTop: 15
    }
})