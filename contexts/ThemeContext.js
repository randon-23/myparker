import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        primaryColor: '#FFD700',
        textColor: '#000',
        backgroundColor: '#000'
    });
    
    const updateTheme = (type) => {
        if (type === 'business') {
            setTheme({
                primaryColor: '#40E0D0',
                textColor: '#000',
                backgroundColor: '#000',
            });
        } else {
            setTheme({
                primaryColor: '#FFD700',
                textColor: '#000',
                backgroundColor: '#000'
            });
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);