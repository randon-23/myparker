import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Defines the default theme
    const [theme, setTheme] = useState({
        primaryColor: '#FFD700',
        textColor: '#000',
        backgroundColor: '#000'
    });
    
    // Exported function to update the theme based on the user type
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

    // Wraps whatever children components are passed to it in the ThemeContext.Provider
    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);