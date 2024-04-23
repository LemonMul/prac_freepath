import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function loadCSV() {
      try {
        const asset = Asset.fromModule(require('./assets/seoul_museums.csv'));
        await asset.downloadAsync();  // 
        const csvContent = await FileSystem.readAsStringAsync(asset.localUri);
        parseCSV(csvContent);
      } catch (e) {
        console.error('Failed to load CSV file', e);
      }
    }

    loadCSV();
  }, []);

  const parseCSV = (data) => {
    const rows = data.split('\n');
    const markers = rows.slice(1, 11).map(row => {
      const columns = row.split(',');
      return {
        latitude: parseFloat(columns[3]),
        longitude: parseFloat(columns[4]),
        title: columns[0],
        description: columns[2]
      };
    });
    setMarkers(markers);
  };

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
        >
          <Callout>
            <Text>{marker.title}</Text>
            <Text>{marker.description}</Text>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

export default MapScreen;
