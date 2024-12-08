import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

const EditPopup = ({ visible, initialText, onSave, onCancel, onSaved }) => {
    const [editedText, setEditedText] = useState(initialText);

    const handleSave = () => {
        onSave(editedText);
        onSaved();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.innerContainer}>
                    <TextInput
                        value={editedText}
                        onChangeText={setEditedText}
                        placeholder="Edit topic text"
                        style={styles.input}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Save" onPress={handleSave} />
                        <Button title="Cancel" onPress={onCancel} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default EditPopup;
