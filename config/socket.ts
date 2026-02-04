// config/socket.js
import { Platform } from 'react-native';

const getSocketUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator
      return 'http://10.0.2.2:3000';
    } else {
      // iOS simulator or physical device
      // Replace with your computer's local IP
      return process.env.EXPO_SOCKET_URL_LOCAL;
    }
  } else {
    // Production
    return process.env.EXPO_SOCKET_URL;
  }
};

export const SOCKET_URL = getSocketUrl();
