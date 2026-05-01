import * as Location from "expo-location";
import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

// Get the device's screen height for responsive map sizing
const { height } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState(null);

  // async function to get the user's current location
  const getlocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied! Please allow location access.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  // Function to handle map tap/press to change marker position
  const handleMapPress = (e) => {
    setLocation(e.nativeEvent.coordinate);
  };

  // Function to handle marker drag end to update coordinates
  const handleMarkerDragEnd = (e) => {
    setLocation(e.nativeEvent.coordinate);
  };

  // Define the region for the map based on the user's location
  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {!location ? (
        <View style={styles.center}>
          <Button title="Get Geo Location" onPress={getlocation} />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
          >
            {/* OpenStreetMap Tile */}
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />

            {/* Draggable Marker */}
            <Marker
              coordinate={location}
              title="My Location"
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          </MapView>

          <View style={styles.info}>
            <Text style={styles.text}>Latitude: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.text}>Longitude: {location.longitude.toFixed(6)}</Text>

            <Button title="Refresh Location" onPress={getlocation} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: height * 0.5,
    width: "100%",
  },
  info: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
