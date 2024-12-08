import React, { useState } from 'react';
import { View, Text, Image, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const FullScreenImageModal = ({ visible, imageUri, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 999,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default FullScreenImageModal;
