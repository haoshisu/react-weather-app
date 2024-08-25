import { useState, useCallback, useEffect } from "react";

const fetchCurrentWeather = (locationName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-FE10B953-1876-47AB-9AF9-AEFE056A776A&limit=5&StationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.Station[0];
      // console.log("13", locationData[0].WeatherElement);
      const weatherElement = {
        WindSpeed: locationData.WeatherElement.WindSpeed,
        AirTemperature: locationData.WeatherElement.AirTemperature,
        RelativeHumidity: locationData.WeatherElement.RelativeHumidity,
      };
      return {
        observationTime: locationData.ObsTime.DateTime,
        description: "多雲時晴",
        temperature: weatherElement.AirTemperature,
        windSpeed: weatherElement.WindSpeed,
        humid: weatherElement.RelativeHumidity,
      };
    });
};

const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-FE10B953-1876-47AB-9AF9-AEFE056A776A&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const forecast = data.records.location[0].weatherElement;
      // console.log("forecase", forecast);
      const weatherElement = {
        description: forecast[0].time[0].parameter.parameterName,
        weatherCode: forecast[0].time[0].parameter.parameterValue,
        rainPossibility: forecast[1].time[0].parameter.parameterName,
        comfortability: forecast[3].time[0].parameter.parameterName,
        locationName: data.records.location[0].locationName,
      };
      return {
        description: weatherElement.description,
        weatherCode: weatherElement.weatherCode,
        rainPossibility: weatherElement.rainPossibility,
        comfortability: weatherElement.comfortability,
        locationName: data.records.location[0].locationName,
      };
    });
};

const useWeatherApi = (currentLocation) => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true,
  });

  const { locationName, cityName } = currentLocation;

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName),
      ]);
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    fetchingData();
  }, [locationName, cityName]);

  useEffect(() => {
    console.log("extend useEffect");
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
