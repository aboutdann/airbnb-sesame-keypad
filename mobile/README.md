# Airbnb Sesame Keypad - React Native Mobile App

## ✅ Build Status

- **iOS Build**: ✅ **SUCCESS** - Builds successfully for iOS Simulator
- **Android Build**: ⚠️ Requires network connectivity to download dependencies (Gradle/AGP)

## 📱 Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   ├── Keypad.tsx          # Keypad UI component
│   │   ├── Display.tsx          # PIN display component
│   │   └── AdminPanel.tsx       # Admin panel component
│   └── services/
│       └── api.ts               # Backend API integration
├── ios/                         # iOS native project
├── android/                     # Android native project
└── App.tsx                      # Main app component
```

## 🚀 Features

- ✅ Virtual keypad UI matching web version
- ✅ PIN entry and validation
- ✅ Admin mode with PIN management
- ✅ Backend API integration
- ✅ Haptic feedback (vibration)
- ✅ Dark theme UI
- ✅ TypeScript support

## 🔧 Setup

### Prerequisites

- Node.js >= 20
- iOS: Xcode 16.4+, CocoaPods
- Android: Java 22, Android SDK

### Installation

```bash
cd mobile
npm install
cd ios && pod install && cd ..
```

### Running

**iOS:**
```bash
npm run ios
# Or: npx react-native run-ios
```

**Android:**
```bash
npm run android
# Or: npx react-native run-android
```

## 🔌 API Configuration

The app connects to your backend API. Update the API URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:8080'  // Development
  : 'https://airbnb-sesame-keypad.onrender.com';  // Production
```

## 📦 Dependencies

- `react-native`: 0.82.1
- `axios`: HTTP client
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-safe-area-context`: Safe area handling

## 🏗️ Build Commands

**iOS:**
```bash
cd ios
xcodebuild -workspace KeypadMobile.xcworkspace \
  -scheme KeypadMobile \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPad (A16)' \
  clean build
```

**Android:**
```bash
cd android
./gradlew clean assembleDebug
```

## ⚠️ Known Issues

1. **Android Build**: Requires network connectivity to download Gradle dependencies from `dl.google.com`
2. **Network**: If you encounter "No route to host" errors, check your network/firewall settings

## 🎯 Next Steps

1. Ensure network connectivity for Android build
2. Test on physical devices
3. Configure production API URL
4. Add app icons and splash screens
5. Configure app signing for release builds
