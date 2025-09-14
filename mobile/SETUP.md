# Mobile App Setup Guide

This guide will help you set up the RenThing mobile application properly.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (globally installed)

## Setup Instructions

### 1. Install Dependencies

Navigate to the mobile directory and install all required dependencies:

```bash
cd mobile
npm install
```

This will install all dependencies listed in package.json, including:
- react-native-paper
- expo-image-picker
- @react-navigation/native
- react-native-safe-area-context

### 2. Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

### 3. Start the Development Server

```bash
npm start
```

Or use one of these commands for specific platforms:
```bash
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For Web
```

## Troubleshooting

### Dependency Issues

If you're seeing errors like "Cannot find module 'react-native-paper'", try these steps:

1. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

3. If you're still having issues, try installing the missing packages individually:
   ```bash
   npm install react-native-paper expo-image-picker @react-navigation/native react-native-safe-area-context
   ```

### iOS Specific Issues

For iOS development, you might need to run:
```bash
cd ios
pod install
cd ..
```

### Android Specific Issues

For Android development, make sure you have:
- Android Studio installed
- Android SDK properly configured
- JAVA_HOME environment variable set

## Required Dependencies

The mobile app requires these key dependencies:
- **react-native-paper**: UI components library
- **expo-image-picker**: For selecting images from device
- **@react-navigation/native**: Navigation library
- **react-native-safe-area-context**: For handling device safe areas
- **@react-navigation/bottom-tabs**: Bottom tab navigation
- **@react-navigation/native-stack**: Stack navigation

## Development Workflow

1. Make sure all dependencies are installed
2. Start the Expo development server
3. Scan the QR code with the Expo Go app on your device
4. Or use an emulator/simulator

## Building for Production

To build the app for production:

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

Note: You'll need an Expo account and proper credentials for building production apps.

## Common Issues and Solutions

### "Module not found" errors
This usually means dependencies aren't installed properly. Run:
```bash
npm install
```

### "Peer dependency" warnings
These are usually safe to ignore unless they cause actual issues.

### TypeScript errors
Make sure you're using a compatible TypeScript version (included in dependencies).

## Support

If you continue to experience issues, please check:
1. Node.js version (should be 18+)
2. All dependencies are properly installed
3. Expo CLI is up to date
4. Platform-specific requirements (Android SDK, Xcode, etc.)