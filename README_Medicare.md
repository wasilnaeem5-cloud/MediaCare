# MediCare – Medical Appointment & Records App

This is a complete React Native (Expo) frontend for the MediCare application.

## 🚀 Features
- **Welcome & Auth Flow**: Beautiful intro screen with Login and Sign Up.
- **Dashboard**: User greeting, upcoming appointments, medical records, and health insights.
- **Appointment Management**: Book, view, and manage appointments.
- **Medical Records**: Secure storage and viewing of medical reports and health info.
- **Profile**: Manage personal information and app preferences.
- **FAQ & Support**: Help section with common questions and contact options.

## 🛠️ Tech Stack
- **Framework**: Expo (React Native)
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **API Client**: Axios
- **Storage**: AsyncStorage
- **Icons**: Lucide React Native
- **Styling**: Vanilla React Native StyleSheet with a central theme.

## 📁 Folder Structure
- `src/screens/`: All application screens.
- `src/components/`: Reusable UI components (Buttons, Inputs, Cards, etc.).
- `src/navigation/`: Navigation configuration and stacks.
- `src/services/`: API configuration and service layers.
- `src/utils/`: Theme constants, storage helpers, and utilities.

## 🌐 Connecting to Backend

The app is pre-configured to use Axios for API calls.

1. **Configure API Base URL**:
   Open `src/services/api.js` and update the `BASE_URL` with your local IP address:
   ```javascript
   export const BASE_URL = 'http://192.168.x.x:5000/api';
   ```
   *Note: Using `localhost` will not work on physical mobile devices. Always use your machine's local IP.*

2. **Endpoints Ready**:
   The `api.js` file includes an interceptor that automatically attaches the JWT token to every request:
   - `POST /auth/signup`
   - `POST /auth/login`
   - `POST /appointments`
   - `GET /appointments`
   - `GET /appointments/upcoming`
   - `GET /appointments/history`

## 🏃 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the App**:
   ```bash
   npx expo start
   ```

3. **Run on Device**:
   Download the **Expo Go** app on your phone and scan the QR code displayed in your terminal.

## 🎨 UI & Design
The app uses a "Soft Blue & Indigo" theme with rounded cards, subtle shadows, and clean typography to provide a premium medical-grade user experience.
