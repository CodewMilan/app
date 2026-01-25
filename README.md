# ProLaunch Hub

A comprehensive mobile app that bridges the gap between college students and their professional careers by combining social networking, project collaboration, competitive learning, mentorship, and job opportunities.

## Features

- **Authentication**: Email OTP login and sign up with Supabase
- **Feed**: Instagram-like social feed for sharing learning progress and achievements
- **Projects**: Create and join collaborative projects to build portfolio-worthy work
- **Hackathons**: Browse, join teams, and participate in competitions
- **College Page**: Exclusive college-specific content, announcements, and events
- **Mentors**: Browse mentor profiles by domain and request mentorship
- **Startups**: Explore internship opportunities and apply directly
- **Profile**: Complete professional profile with achievements, skills, and social links

## Tech Stack

- React Native with Expo
- React Navigation (Bottom Tabs & Stack)
- Supabase (Authentication & Database)
- Expo Vector Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free tier available)

### Supabase Setup

1. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Get your project credentials:
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon public` key
3. Update `config/supabase.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Authentication Flow

1. **Login**: Enter email → Receive OTP → Verify OTP → Access app
2. **Sign Up**: Create account with email, password, name, and college → Verify email → Login

The app uses Supabase's email OTP authentication for secure login without passwords.

## Deployment

### iOS (App Store)

1. Build the app:
```bash
expo build:ios
```

2. Follow Expo's instructions to submit to App Store

### Android (Play Store)

1. Build the app:
```bash
expo build:android
```

2. Follow Expo's instructions to submit to Play Store

## Project Structure

```
prolaunchhub/
├── App.js                 # Main app component with auth flow
├── config/
│   └── supabase.js       # Supabase configuration
├── contexts/
│   └── AuthContext.js     # Authentication context provider
├── screens/               # All screen components
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── OTPVerificationScreen.js
│   ├── FeedScreen.js
│   ├── ProjectsScreen.js
│   ├── HackathonsScreen.js
│   ├── CollegeScreen.js
│   ├── MentorsScreen.js
│   ├── StartupsScreen.js
│   └── ProfileScreen.js
├── assets/                # Images and icons
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── babel.config.js       # Babel configuration
```

## Notes

- Authentication is handled by Supabase with email OTP
- All screens currently use mock data for demonstration purposes
- The app is ready for deployment to both iOS App Store and Google Play Store
- Make sure to configure your Supabase project before running the app
