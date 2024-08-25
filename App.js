import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigator from './navigation/MainNavigation';
import { AuthProvider } from '../myparker/contexts/AuthContext.js';
import { ThemeProvider } from '../myparker/contexts/ThemeContext.js';
import { checkFirstLaunch, requestPermissions } from './services/LaunchService.js'

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  // Check if the app has been launched before for permissions
  useEffect(() => {
    checkFirstLaunch(setIsFirstLaunch);
  }, [])

  // Request permissions if it's the first launch
  useEffect(() => {
    requestPermissions(isFirstLaunch);
  }, [isFirstLaunch])

  // Wrapping the app in the ThemeProvider and AuthProvider contexts which are accessed throughout the application
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
