import React, { createContext, useContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './AuthProvider';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [currentUser, setCurrentUser] = useState(null);
    const [coinValue,setCoinValue] = useState(0);
    const fetchCurrentUser = async () => {
        const userDoc = await firestore().collection('users').where('userId', '==', user.uid).get();
        const userData = userDoc.docs[0]?.data();
        setCurrentUser(userData);
    };

    /* const fetchUserCoinValue = async () => {
        try {
            const userId = user.uid;
            const userDoc = await firestore().collection('users').doc(userId).get();

            if (userDoc.exists) {
                const coinValue = userDoc.data().coin;
                setCoinValue(coinValue);
            }
        } catch (error) {
            console.error('Error fetching user coin value: ', error);
        }
    };

    const subscribeToCoinValueChanges = () => {
        const userId = user.uid;
        const userDocRef = firestore().collection('users').doc(userId);

        const unsubscribe = userDocRef.onSnapshot((doc) => {
            const coinValue = doc.data()?.coin;
            setCoinValue(coinValue);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribeCoinValue = subscribeToCoinValueChanges();
        fetchUserCoinValue();

        return () => {
            unsubscribeCoinValue();
        };
    }, [user]); */

    useEffect(() => {
        fetchCurrentUser();
    }, [user]);

    return (
        <UserContext.Provider value={currentUser}>
            {children}
        </UserContext.Provider>
    );
};

export const useCurrentUser = () => {
    const currentUser = useContext(UserContext);
    return currentUser;
};
