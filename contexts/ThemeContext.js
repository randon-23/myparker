import React, { createContext, useContext, useState } from 'react';

const defaultTheme = {
    primaryColor: '#FFD700',
    textColor: '#000',
    backgroundColor: '#000',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme);

    const updateTheme = (type) => {
        if (type === 'business') {
            setTheme({
                primaryColor: '#40E0D0',
                textColor: '#000',
                backgroundColor: '#000',
            });
        } else {
            setTheme(defaultTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);