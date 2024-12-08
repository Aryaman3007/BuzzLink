import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color="#FF0032" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
});

export default LoadingModal;