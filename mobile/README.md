# RenThing Mobile

Expo-based mobile application for RenThing rental marketplace.

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your mobile device.

### Available Scripts

- `npm start` - Start the development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS simulator (macOS only)
- `npm run web` - Start web version

### Project Structure

```
mobile/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── assets/              # Images, fonts, etc.
└── app.json            # Expo configuration
```

### Development Notes

- The mobile app uses the same backend API as the web app
- API base URL is configured in `src/services/api/client.ts`
- Update the API_BASE_URL to point to your development server
- For local development, use your machine's IP address instead of localhost

### Features

- User authentication (login/register)
- Browse rental items
- View booking history
- User profile management
- Responsive design for mobile devices

### Tech Stack

- React Native with Expo
- TypeScript
- React Navigation
- React Native Paper (Material Design)
- Axios for API calls
- Secure storage for authentication tokens