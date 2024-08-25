import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';

// Checks if this is the first launch of the application
export const checkFirstLaunch = async (setIsFirstLaunch) => {
    // Retrieve the value from AsyncStorage to see if the app has been launched before
    const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');

    if (alreadyLaunched === null) {
        // If this is the first launch, set the flag and store the value in AsyncStorage
        setIsFirstLaunch(true);
        AsyncStorage.setItem('alreadyLaunched', 'true');
    } else {
        // If the app has been launched before, set the flag accordingly
        setIsFirstLaunch(false);
    }
};

// Requests permissions to access the Media Library
export const requestMediaLibraryPermissions = async () => {
    // Get the current permission status for the Media Library
    const { status: mediaLibraryStatus } = await MediaLibrary.getPermissionsAsync();

    // If permissions are not granted, request them from the user
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

// Requests permissions to access the Camera, used in both initial setup and QR code scanner screens
// This function is usable both in initial setup and in the QR code scanner screen, latter of which it affects the setHasPermission state in the component it's called from
// Optional parameter for the setHasPermission state for when the function is called from the QR code scanner screen, and not from the initial load
export const requestCameraPermissions = async (setHasPermission = null) => {
    // Get the current permission status for the Camera
    const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();

    if (cameraStatus !== 'granted') {
        // Request the permission if it hasn't been granted
        const { status: newCameraStatus } = await Camera.requestCameraPermissionsAsync();

        // Set hasPermission based on the result of the permission request
        if (setHasPermission) {
            setHasPermission(newCameraStatus === 'granted');
        }

        // If the user still denies the permissions, show an alert
        if (newCameraStatus !== 'granted') {
            Alert.alert(
                'Permission Required',
                'We need permission to access your camera to scan QR codes.'
            );
        }
    } else {
        // If permission was already granted, update the hasPermission state accordingly
        if (setHasPermission) {
            setHasPermission(true);
        }
    }
};

// Wrapper function which requests both Media Library and Camera permissions during the first launch of the app
export const requestPermissions = async (isFirstLaunch) => {
    // Only request permissions if this is the first time the app is launched
    if (isFirstLaunch) {
        await requestMediaLibraryPermissions();
        await requestCameraPermissions();
    }
};