This application is solely developed for use in Android OS - no hardware was available for testing on iOS i.e. physical phone and emulator was Windows
To run this application, make sure you have Android Studio and and on it the respective Android emulator. Can be any type of emulator, development 
was done on a Google Pixel 3 API 34 with Android 14.0 (UpsideDownCake) OS

Ensure that machine you are running application on has Node.js, npm and Expo CLI installed to correctly set up the environment
- Node.js and npm are available to install from Node.js official website or a package manager such as Chocolatey using command choco install nodejs
- npm is included with the Node.js install

When Node and npm are installed, install Expo CLI globally:
npm install -g expo-cli

Change directory to the project directory:
cd <project-directory>

Run the following commands to install dependencies to be able to run the project:
npx expo install OR npm install
npx expo install ensures that all dependencies are compatible with the installed Expo SDK version

Once dependencies have been installed, run the Androd emulator. Once again, make sure to have Android Studio installed and at least one emulator set up (Google Pixel 3 in my case).
When this is done run the following command
npm run android --clear
--clear ensures that hte cache is cleared before running the project

To access application on Expo Snack - remember to switch device to Android on Expo Snack (also since QR Code scanning is core functionality, that is not going to work on Expo Snack, however you can see the result of actions done on Expo Go on a physical device such as generated business and parking QR Codes and the latter's status)
EXPO SNACK URL: https://snack.expo.dev/@arandon24/github.com-randon-23-myparker

TO USE THIS APPLICATION TO ITS FULL POTENTIAL, AT LEAST ONE PHYSICAL ANDROID DEVICE IS REQUIRED DUE TO DEPENDENCY ON CAMERA QR CODE SCANNING AS A CENTRAL ELEMENT. IDEALLY 2 PHYSICAL DEVICES, HOWEVER ONE CAN STILL OPERATE BY SWITCHING ACCOUNTS BETWEEN 1 PHYSICAL EXPO GO-BASED AND ONE ON THE EMULATOR.

FUNCTIONALITY WILL BE SHOWN IN APPENDED VIDEO

SAMPLE USER ACCOUNTS (YOU CAN STILL SIGN UP OTHER ACCOUNTS IF YOU WANT)

CUSTOMER
Email: testuser123@gmail.com
Password: uolcustomer1

BUSINESS
Email: testbusiness123@gmail.com
Password: uolbusiness1