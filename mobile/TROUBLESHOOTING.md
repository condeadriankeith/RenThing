# Mobile App Troubleshooting Guide

This guide helps resolve common issues with the RenThing mobile application.

## Common Issues and Solutions

### 1. "Cannot find module" Errors

**Error Examples:**
- `Cannot find module 'react-native-paper'`
- `Cannot find module 'expo-image-picker'`
- `Cannot find module '@react-navigation/native'`
- `Cannot find module 'react-native-safe-area-context'`

**Solutions:**

1. **Ensure dependencies are installed:**
   ```bash
   cd mobile
   npm install
   ```

2. **Clean and reinstall if issues persist:**
   ```bash
   # Remove node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Reinstall dependencies
   npm install
   ```

3. **Install missing packages individually:**
   ```bash
   npm install react-native-paper expo-image-picker @react-navigation/native react-native-safe-area-context @react-navigation/bottom-tabs @react-navigation/native-stack
   ```

### 2. TypeScript Compilation Errors

**Solutions:**

1. **Check TypeScript version compatibility:**
   The project uses TypeScript ~5.8.3. Make sure your IDE is using the workspace version.

2. **Restart TypeScript server:**
   In VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

3. **Rebuild TypeScript definitions:**
   ```bash
   cd mobile
   npx tsc --noEmit --watch
   ```

### 3. Expo Development Server Issues

**Solutions:**

1. **Clear Expo cache:**
   ```bash
   npx expo start -c
   ```

2. **Reset Metro bundler cache:**
   ```bash
   npx react-native start --reset-cache
   ```

3. **Check port conflicts:**
   The default port is 19000. If it's in use, Expo will automatically use another port.

### 4. iOS Specific Issues

**Common Problems:**
- CocoaPods dependencies not installed
- Xcode not installed or configured
- iOS simulator issues

**Solutions:**

1. **Install/update CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

2. **Install iOS pods:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Open in Xcode:**
   ```bash
   cd ios
   open RenThing.xcworkspace
   ```

### 5. Android Specific Issues

**Common Problems:**
- Android SDK not installed
- JAVA_HOME not set
- Android emulator issues

**Solutions:**

1. **Install Android Studio:**
   Download from https://developer.android.com/studio

2. **Set environment variables:**
   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Accept Android licenses:**
   ```bash
   sdkmanager --licenses
   ```

### 6. Navigation Issues

**Common Problems:**
- Navigation not working
- Type errors with navigation props

**Solutions:**

1. **Ensure all navigation dependencies are installed:**
   ```bash
   npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
   ```

2. **Install native dependencies:**
   ```bash
   npm install react-native-screens react-native-safe-area-context
   ```

3. **For iOS, complete native installation:**
   ```bash
   cd ios && pod install && cd ..
   ```

### 7. UI Component Issues

**Common Problems:**
- react-native-paper components not working
- Styling issues

**Solutions:**

1. **Ensure react-native-paper is installed:**
   ```bash
   npm install react-native-paper
   ```

2. **Install vector icons:**
   ```bash
   npm install react-native-vector-icons
   ```

3. **For iOS, link vector icons:**
   ```bash
   cd ios && pod install && cd ..
   ```

### 8. Image Picker Issues

**Common Problems:**
- Image picker not opening
- Permission errors

**Solutions:**

1. **Ensure expo-image-picker is installed:**
   ```bash
   npm install expo-image-picker
   ```

2. **Request permissions in code:**
   ```javascript
   import * as ImagePicker from 'expo-image-picker';
   
   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   if (status !== 'granted') {
     // Handle permission denial
   }
   ```

### 9. Network/ API Issues

**Common Problems:**
- API calls failing
- CORS issues

**Solutions:**

1. **Check API endpoint configuration:**
   Ensure the API URL is correctly configured in the mobile app.

2. **For iOS simulator, enable HTTP connections:**
   Add to `ios/PROJECT_NAME/Info.plist`:
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
     <key>NSAllowsArbitraryLoads</key>
     <true/>
   </dict>
   ```

3. **For Android, allow cleartext traffic:**
   Add to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application
     android:usesCleartextTraffic="true">
   </application>
   ```

## Development Environment Checks

### Verify Node.js Version
```bash
node --version
# Should be v18 or higher
```

### Verify npm Version
```bash
npm --version
```

### Check Installed Dependencies
```bash
npm list --depth=0
```

## IDE Configuration

### VS Code

1. **Recommended Extensions:**
   - ESLint
   - Prettier
   - TypeScript Importer
   - React Native Tools

2. **Workspace Settings:**
   Create `.vscode/settings.json`:
   ```json
   {
     "typescript.preferences.includePackageJsonAutoImports": "on",
     "typescript.suggest.autoImports": true,
     "typescript.updateImportsOnFileMove.enabled": "always"
   }
   ```

## When to Reinstall Everything

If you continue to experience issues, try a complete reinstall:

1. **Delete all generated files:**
   ```bash
   cd mobile
   rm -rf node_modules
   rm -rf package-lock.json
   rm -rf ios/Pods
   rm -rf ios/build
   rm -rf android/build
   rm -rf android/app/build
   ```

2. **Reinstall dependencies:**
   ```bash
   npm install
   ```

3. **Reinstall iOS pods (if on macOS):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Getting Help

If you're still experiencing issues:

1. **Check the Expo documentation:** https://docs.expo.dev/
2. **Check React Native documentation:** https://reactnative.dev/
3. **Check specific library documentation**
4. **Search for error messages on Stack Overflow**
5. **Ask for help in development communities**

Include these details when seeking help:
- Exact error message
- Operating system
- Node.js version
- npm version
- Steps you've already tried