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