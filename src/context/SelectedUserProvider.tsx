import React, { createContext, useState, useContext } from 'react';

const SelectedUserContext = createContext();

export const SelectedUserProvider = ({ children }) => {
    const [selectedUserData, setSelectedUserData] = useState(null);

    const setSelectedUser = (userId, userName) => {
        setSelectedUserData({ userId, userName });
    };

    return (
        <SelectedUserContext.Provider value={{ selectedUserData, setSelectedUser }}>
            {children}
        </SelectedUserContext.Provider>
    );
};

export const useSelectedUser = () => useContext(SelectedUserContext);
