import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // JSON 데이터를 직접 불러옵니다.
    const markerData = require('./assets/museum.json');

    // 마커 데이터 파싱
    const parsedMarkers = markerData.map((item, index) => {
      const latitude = parseFloat(item.위도);
      const longitude = parseFloat(item.경도);

      if (!isNaN(latitude) && !isNaN(longitude)) {  // 좌표 유효성 검사
        return {
          key: index.toString(),
          latitude: latitude,
          longitude: longitude,
          title: item.시설명,
          description: item.운영기관전화번호
        };
      }
    }).filter(marker => marker);  // 유효하지 않은 데이터 제거

    console.log("Valid markers:", parsedMarkers);  // 유효한 마커 로그 출력
    setMarkers(parsedMarkers);
  }, []);

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
      {markers.map(marker => (
        <Marker
          key={marker.key}
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
