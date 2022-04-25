import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

// ES6사용 === const SCREEN_WIDTH = Dimensions.get("window").width;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = 'bd093f06d918ed4f87f1396a260737b8';

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Rain: 'rains',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snowflake',
  Drizzle: 'rain',
  ThunderStorm: 'lightning',
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    // console.log(permission);
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    // console.log(location) 이 안에 위도와 경도를 가지고 있다.
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    // console.log(location[0].city) or location
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    // console.log(json.daily);
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        style={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator style={{ marginTop: 10 }} color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
    color: 'white',
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    color: 'white',
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: 'white',
    fontWeight: '500',
  },
  tinyText: {
    fontSize: 25,
    marginTop: -5,
    color: 'white',
    fontWeight: '500',
  },
});
