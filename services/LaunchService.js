import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';

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

export const requestMediaLibraryPermissions = async () => {
  // Request Media Library permissions
  const { status: mediaLibraryStatus } = await MediaLibrary.getPermissionsAsync();

  // If permissions are not granted, request them
  if (mediaLibraryStatus !== 'granted') {
      const { status: newMediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();

      // If permissions are still not granted, show an alert as a warning to the user that they will need to give permission to save QR codes
      if (newMediaLibraryStatus !== 'granted') {
          Alert.alert(
              'Permission Required',
              'We need permission to access your media library to save QR codes.'
          );
      }
  }
};

// This function is usable both in initial setup and in the QR code scanner screen, latter of which it affects the setHasPermission state in the component it's called from
export const requestCameraPermissions = async (setHasPermission = null) => {
  // Request Camera permissions
  const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();

  if (cameraStatus !== 'granted') {
      // Request the permission if it hasn't been granted
      const { status: newCameraStatus } = await Camera.requestCameraPermissionsAsync();

      // Set hasPermission based on the result of the permission request
      if (setHasPermission) {
          setHasPermission(newCameraStatus === 'granted');
      }

      // If the new status is not granted, show an alert
      if (newCameraStatus !== 'granted') {
          Alert.alert(
              'Permission Required',
              'We need permission to access your camera to scan QR codes.'
          );
      }
  } else {
      // If permission was already granted, update the state accordingly
      if (setHasPermission) {
          setHasPermission(true);
      }
  }
};

export const requestPermissions = async (isFirstLaunch) => {
  if (isFirstLaunch) {
      await requestMediaLibraryPermissions();
      await requestCameraPermissions();
  }
};