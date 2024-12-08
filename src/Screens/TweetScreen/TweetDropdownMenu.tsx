import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EditPopup from './EditPopup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const TweetDropdownMenu = ({ onClose, topicId, topicText, topicOwner, isOpen }) => {
    const navigation = useNavigation();
    const currentUserId = auth().currentUser?.uid;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(isOpen);
    const { isDarkMode } = useContext(ThemeContext);

    const handleReport = () => {
        navigation.navigate('Report', { topicId });
        onClose();
    };

    useEffect(() => {
        setIsDropdownOpen(isOpen);
    }, [isOpen]);

    const handleFollow = () => {
        onClose();
    };

    const handleBlock = () => {
        onClose();
    };

    const handleEdit = () => {
        setEditVisible(true);
    };

    const handleDelete = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = () => {
        firestore()
            .collection('Topics')
            .doc(topicId)
            .delete()
            .then(() => {
                console.log('Topic deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting topic: ', error);
            });
        onClose();
        setShowConfirmationModal(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    const handleEditSave = (editedText) => {
        firestore().collection('Topics').doc(topicId).update({
            topicText: editedText,
        }).then(() => {
            console.log('Topic text updated successfully!');
            setEditVisible(false);
            onClose();
        }).catch((error) => {
            console.error('Error updating topic text: ', error);
        });
    };

    const handleEditCancel = () => {
        setEditVisible(false);
        onClose();
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {/* <Menu>
                <MenuTrigger>
                    <Ionicons name="ellipsis-vertical" size={22} color={theme.iconColor} />
                </MenuTrigger>
                <MenuOptions
                    style={[
                        styles.menuOptions,
                        { backgroundColor: theme.modelColor1, borderRadius: 10, width: 150 }
                    ]}>
                    {auth().currentUser?.uid === topicOwner ? (
                        <>
                            <MenuOption onSelect={handleEdit}>
                                <Text style={[styles.optionText, { color: theme.textColor }]}>Edit</Text>
                            </MenuOption>
                            <MenuOption onSelect={handleDelete}>
                                <Text style={[styles.optionText, { color: theme.textColor }]}>Delete</Text>
                            </MenuOption>
                        </>
                    ) : (
                        <>
                            <MenuOption onSelect={handleReport}>
                                <Text style={[styles.optionText, { color: theme.textColor }]}>Report</Text>
                            </MenuOption>
                            <MenuOption onSelect={handleFollow}>
                                <Text style={[styles.optionText, { color: theme.textColor }]}>Follow</Text>
                            </MenuOption>
                            <MenuOption onSelect={handleBlock}>
                                <Text style={[styles.optionText, { color: theme.textColor }]}>Block</Text>
                            </MenuOption>
                        </>
                    )}
                </MenuOptions>
            </Menu> */}
            {/* <EditPopup
                visible={editVisible}
                initialText={topicText}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
                onSaved={() => onClose()}
            /> */}
            <Modal
                visible={showConfirmationModal}
                transparent={true}
                animationType="fade"
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.modalBackgroundColor }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.modalContentBackgroundColor }]}>
                        <Text style={[styles.modalText, { color: theme.textColor }]}>Are you sure you want to delete this topic?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={handleConfirmDelete} style={[styles.modalButton, styles.deleteButton, { borderColor: theme.buttonBorderColor }]}>
                                <Text style={[styles.modalButtonText, { color: theme.buttonTextColor }]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelDelete} style={[styles.modalButton, { borderColor: theme.buttonBorderColor }]}>
                                <Text style={[styles.modalButtonText, { color: theme.buttonTextColor }]}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const lightTheme = {
    backgroundColor: 'white',
    textColor: 'black',
    iconColor: 'gray',
    modalBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    modalContentBackgroundColor: 'white',
    buttonBorderColor: '#ccc',
    buttonTextColor: '#333',
    modelColor: 'white',
    modelColor1: 'white'
};

const darkTheme = {
    backgroundColor: Colors.profileBlack,
    textColor: 'black',
    modelColor: 'black',
    iconColor: 'gray',
    modalBackgroundColor: 'rgba(255, 255, 255, 0.5)',
    modalContentBackgroundColor: '#333333',
    buttonBorderColor: 'black',
    buttonTextColor: 'black',
    modelColor1: 'white'
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10,
        position: 'absolute',
        top: 11,
        right: 10,
        zIndex: 1,
    },
    optionText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
        borderWidth: 1,
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    modalButtonText: {
        fontSize: 16,
    },
    menuOptions: {

    }
});

export default TweetDropdownMenu;