import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Callout, Polygon } from 'react-native-maps';
import axios from 'axios';
import randomColor from 'randomcolor';  // 랜덤 색상 생성 라이브러리 추가

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    // 마커 데이터 로드
    const markerData = require('./assets/museum.json');

    // 마커 데이터 파싱
    const parsedMarkers = markerData.map((item, index) => {
      const latitude = parseFloat(item.위도);
      const longitude = parseFloat(item.경도);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        return {
          key: index.toString(),
          latitude: latitude,
          longitude: longitude,
          title: item.시설명,
          description: item.운영기관전화번호
        };
      }
    }).filter(marker => marker);

    setMarkers(parsedMarkers);

    // 서울시 구별 GeoJSON 데이터 로드
    axios.get('https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json')
      .then(response => {
        const data = response.data;
        const districtsWithColor = data.features.map((feature, index) => ({
          ...feature,
          color: randomColor({ luminosity: 'dark' })  // 각 구별로 랜덤 색상 적용
        }));
        setDistricts(districtsWithColor);
      });
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
      {districts.map((district, index) => (
        <Polygon
          key={index}
          coordinates={district.geometry.coordinates[0].map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
          }))}
          strokeColor={district.color} // 테두리 색상 적용
          fillColor="transparent"      // 내부 색상을 투명으로 설정
          strokeWidth={2}              // 테두리 두께 설정
        />
      ))}
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
