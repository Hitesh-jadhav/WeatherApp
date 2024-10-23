
# WeatherApp 🌦️

A React Native application that provides real-time weather updates based on the user's location using geolocation services.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Building the APK](#building-the-apk)
- [Contributing](#contributing)
- [License](#license)

## Introduction
WeatherApp is a simple and elegant React Native mobile application that shows the current weather details using geolocation. The app can also fetch weather data for other locations by searching city names.

## Features
- Fetches real-time weather data based on the user's location.
- Search weather by city name.
- Displays temperature, humidity, wind speed, and weather conditions.

## Tech Stack
- **React Native**: Framework for building cross-platform mobile apps.
- **Geolocation Service**: Used to get the user's location.
- **OpenWeather API**: To fetch weather data.

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/Hitesh-jadhav/WeatherApp.git
    cd WeatherApp
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create an `.env` file and add your OpenWeather API key:
    ```bash
    REACT_NATIVE_WEATHER_API_KEY=your_openweather_api_key
    ```

4. Link the geolocation package (if not done automatically):
    ```bash
    npx react-native link react-native-geolocation-service
    ```

## Usage

1. Start the development server:
    ```bash
    npx react-native start
    ```

2. Run the app on Android or iOS:
    ```bash
    npx react-native run-android
    npx react-native run-ios
    ```

## Building the APK

To generate a signed APK:

1. Open `android/app/build.gradle` and modify the `signingConfigs` to match your release key details:
    ```gradle
    signingConfigs {
        release {
            storeFile file("your-release-key.keystore")
            storePassword "your-store-password"
            keyAlias "your-key-alias"
            keyPassword "your-key-password"
        }
    }
    ```

2. Generate the APK:
    ```bash
    cd android
    ./gradlew assembleRelease
    ```

The generated APK can be found in the `android/app/build/outputs/apk/release` folder.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss improvements and new features.

## License
This project is licensed under the MIT License.
