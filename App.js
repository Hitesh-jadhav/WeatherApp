import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator, // For showing loading indicator
  PermissionsAndroid, // For Android-specific permission handling
  Platform,
  StyleSheet,
  TouchableOpacity,
  ImageBackground, // For adding a background image
} from 'react-native';
import Geolocation from 'react-native-geolocation-service'; // For accessing device geolocation
import axios from 'axios'; // For making API requests

// Replace with your OpenWeather API Key
const API_KEY = 'your_OpenWeather_API_Key';

export default function App() {
  // State to hold the user's current location (latitude and longitude)
  const [location, setLocation] = useState(null);
  // State to hold the fetched weather data from the OpenWeather API
  const [weather, setWeather] = useState(null);
  // State to store the city name input by the user for searching weather data
  const [searchLocation, setSearchLocation] = useState('');
  // State to manage loading state while fetching data
  const [loading, setLoading] = useState(false);
  // State to store error messages if any occur
  const [errorMsg, setErrorMsg] = useState('');

  // Function to get weather data based on latitude and longitude
  const getWeatherData = async (lat, lon) => {
    try {
      setLoading(true); // Start loading
      // Fetch weather data from OpenWeather API based on coordinates
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data); // Set the fetched weather data in state
      setLoading(false); // Stop loading
    } catch (error) {
      setErrorMsg('Failed to fetch weather data.'); // Set error message in case of failure
      setLoading(false); // Stop loading
    }
  };

  // Function to get weather data by searching for a specific location (city name)
  const getWeatherByLocationName = async (cityName) => {
    try {
      setLoading(true); // Start loading
      // Fetch weather data based on city name
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data); // Set the fetched weather data in state
      setLoading(false); // Stop loading
    } catch (error) {
      setErrorMsg('Location not found.'); // Set error message if the location is not found
      setLoading(false); // Stop loading
    }
  };

  // Function to request location permissions for Android devices
  const getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      // Request fine location permission for Android
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Weather App Location Permission',
          message: 'Weather App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      // Check if permission is granted
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    }
    return true; // For iOS, assume permission is granted
  };

  // Function to get the user's current location
  const getLocation = async () => {
    const hasPermission = await getLocationPermission(); // Check if location permission is granted
    if (!hasPermission) {
      setErrorMsg('Location permission denied.'); // Show error if permission is denied
      return;
    }

    // Use Geolocation to get the current position of the device
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords); // Set the fetched coordinates (latitude and longitude)
        // Fetch weather data based on the current location
        getWeatherData(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setErrorMsg('Unable to retrieve location. Please check your GPS settings.'); // Error handling for location retrieval failure
        console.error('Geolocation Error:', error);  // Log the error
      },
      {
        enableHighAccuracy: true, // Enable high accuracy for better GPS precision
        timeout: 30000, // Increased timeout (30 seconds) to allow accurate location fetching
        maximumAge: 10000, // Cache the location for 10 seconds before fetching a new one
        distanceFilter: 10, // Update location if the device moves 10 meters or more
      }
    );
  };

  // useEffect to fetch the location and weather data when the app first loads
  useEffect(() => {
    getLocation(); // Call the function to get the location on component mount
  }, []);

  return (
    // ImageBackground allows for a background image on the screen
    <ImageBackground
      source={{ uri: 'https://wallpaperaccess.com/full/396579.jpg' }} // URL for a weather-themed background image
      style={styles.background}
      resizeMode="cover" // Cover the entire background with the image
    >
      {/* Overlay view to darken the background and improve text readability */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Weather App</Text>

        {/* Conditional rendering to show error message, loading indicator, or weather data */}
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text> // Display error message
        ) : loading ? (
          <ActivityIndicator size="large" color="#fff" /> // Show loading spinner while fetching data
        ) : weather ? (
          <View style={styles.weatherContainer}>
            {/* Display location name and country */}
            <Text style={styles.weatherText}>
              {`Location: ${weather.name}, ${weather.sys.country}`}
            </Text>
            {/* Display temperature */}
            <Text style={styles.weatherText}>
              {`Temperature: ${weather.main.temp}°C`}
            </Text>
            {/* Display weather description */}
            <Text style={styles.weatherText}>
              {`Weather: ${weather.weather[0].description}`}
            </Text>
          </View>
        ) : null}

        {/* Button to refresh the location and fetch weather data again */}
        <TouchableOpacity style={styles.button} onPress={
          () => {
            if (searchLocation.trim()) {
              getWeatherByLocationName(searchLocation);
            } else {
              getLocation();
            }
          }
        }>
          <Text style={styles.buttonText}>Refresh Location</Text>
        </TouchableOpacity>

        {/* Input field for searching weather by city name */}
        <TextInput
          style={styles.input}
          placeholder="Search Location"
          placeholderTextColor="#ddd" // Placeholder text color
          value={searchLocation}
          onChangeText={(text) => setSearchLocation(text)} // Update searchLocation state on input change
        />
        {/* Button to search weather data by city name */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => getWeatherByLocationName(searchLocation)} // Fetch weather data based on city name
        >
          <Text style={styles.buttonText}>Search Weather</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Styling for the app components
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', // Center contents vertically
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay for better readability
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // White text color
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherContainer: {
    marginVertical: 20,
    alignItems: 'center', // Center the weather information
  },
  weatherText: {
    fontSize: 20,
    color: '#fff', // White text color
    fontWeight: '500',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#fff', // White border color for input
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
    borderRadius: 5,
    color: '#fff', // Input text color
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent input field
  },
  button: {
    backgroundColor: '#1e90ff', // Blue button color
    padding: 15,
    borderRadius: 25, // Rounded button
    alignItems: 'center', // Center the button text
    width: '80%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff', // White text color for buttons
    fontSize: 18,
  },
  errorText: {
    color: 'red', // Red text color for error messages
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
