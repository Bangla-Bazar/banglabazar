# BanglaBazar - South Asian Grocery Store

A modern web application for BanglaBazar, a South Asian grocery store located in Lansdale, PA. Built with Next.js, Firebase, and Tailwind CSS.

## Features

### User Features
- Browse products with search and filter functionality
- View featured products and weekly specials
- Learn about the store and its location
- Responsive design for all devices

### Admin Features
- Secure admin login system
- Manage products (add, edit, delete)
- Manage banners for weekly specials
- View basic analytics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Vercel
- **Icons**: Heroicons
- **UI Components**: Custom components with Tailwind CSS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/banglabazar.git
   cd banglabazar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Enable Storage
5. Add your web app to get the configuration values
6. Set up security rules for Firestore and Storage

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 