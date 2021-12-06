import { baseURLApi } from './index';

export async function getWeatherByCityName(cityName: string) {
  try {
    return await baseURLApi.request(`&q=${cityName}`, {
      method: 'GET'
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function getWeatherByLocation(lat: number, lon: number) {
  try {
    return await baseURLApi.request(`&lat=${lat}&lon=${lon}`, {
      method: 'GET'
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
