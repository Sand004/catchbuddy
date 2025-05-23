import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.catchsmart.app',
  appName: 'CatchSmart',
  webDir: '../web/out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Camera: {
      permissions: {
        camera: 'Die App benötigt Kamera-Zugriff für Equipment-Fotos'
      }
    },
    Geolocation: {
      permissions: {
        location: 'Die App benötigt Standort-Zugriff für Angelplatz-Empfehlungen'
      }
    }
  }
};

export default config;