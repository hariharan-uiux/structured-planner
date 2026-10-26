import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.structured.planner',
  appName: 'Structured',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
