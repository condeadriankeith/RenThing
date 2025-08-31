# Quick Start Guide

## 1. Install Mobile Dependencies

```bash
cd mobile
npm install
```

## 2. Update API Configuration

Edit `mobile/src/services/api/client.ts` and update the API_BASE_URL:

```typescript
// For local development, use your machine's IP address
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
// Example: const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

## 3. Start the Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Generate a QR code
- Open Expo Dev Tools in your browser

## 4. Run on Your Device

1. Download the **Expo Go** app from your device's app store
2. Open Expo Go and scan the QR code shown in the terminal
3. The app will load on your device

## 5. Development Workflow

- Make changes to the code
- The app will automatically reload on your device
- Use the Expo Dev Tools in your browser for additional debugging

## Troubleshooting

### Common Issues:

1. **Network Error**: Ensure your device and computer are on the same WiFi network
2. **API Connection**: Update the API_BASE_URL to use your machine's IP address
3. **Port Already in Use**: Change the port with `npm start -- --port 8081`

### Get Your IP Address:

**Windows:**
```bash
ipconfig
```

**macOS/Linux:**
```bash
ifconfig
```

## Next Steps

1. Test authentication flow
2. Add more screens and features
3. Configure push notifications
4. Add camera/image upload functionality
5. Set up location services for item search

## Testing on Physical Devices

The mobile app is now ready for testing with Expo Go. All major features are implemented:
- User authentication
- Navigation structure
- API integration
- Responsive design
- Material Design UI components