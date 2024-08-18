import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export const checkFirstLaunch = async (setIsFirstLaunch) => {
    const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');

    if (alreadyLaunched === null) {
      // First launch
      setIsFirstLaunch(true);
      AsyncStorage.setItem('alreadyLaunched', 'true');
    } else {
      setIsFirstLaunch(false);
    }
};

export const requestPermissions = async (isFirstLaunch) => {
    if (isFirstLaunch) {
        const { status } = await MediaLibrary.getPermissionsAsync();

        if (status !== 'granted') {
          const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();

          if (newStatus !== 'granted') {
            Alert.alert(
              'Permission Required',
              'We need permission to access your media library to save QR codes.'
            );
          }
        }
    }
}