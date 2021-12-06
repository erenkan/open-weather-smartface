import ServiceCall from '@smartface/extension-utils/lib/service-call';

const apiKey = '177c2c97b62e34ac818255c90280f3c6';

export const baseURLApi = new ServiceCall({
  baseUrl: `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`,
  logEnabled: true,
  headers: {
    apiVersion: '1.0'
  }
});
