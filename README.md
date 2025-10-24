# CrestKeys 🏡

<div align="center">
  
<img src="https://github.com/user-attachments/assets/31000bb5-2c9b-4089-a4a4-d0c56164dba1" alt="landingp" width="200" height="200"/>



**Your Ultimate Real Estate Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5-green.svg)](https://www.mongodb.com/)

</div>

## 📋 Overview

CrestKeys is a comprehensive real estate platform that connects property buyers, renters, and vacation seekers with available listings. The platform offers a seamless experience for users to browse, create, and manage property listings with an intuitive interface.

### Who is it for?

- **Property Owners**: List your properties for sale, rent, or as vacation stays
- **Home Buyers**: Find your dream home with detailed listings and photos
- **Renters**: Discover rental properties that match your preferences
- **Vacationers**: Book the perfect vacation spot for your next getaway


<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img height="1547" alt="image" src="https://github.com/user-attachments/assets/74685908-aa2b-4bdb-a651-532fb146c68f" width="100%" />
      </td>
      <td width="50%">
        <img width="2801" height="1547" alt="image" src="https://github.com/user-attachments/assets/3ebd49bc-c779-43cd-b56d-c721cb98dbdb" width="100%" />
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="https://github.com/user-attachments/assets/40231b16-b074-47de-8a73-d33a3d365a09" alt="Image 1" width="100%" />
      </td>
      <td width="50%">
        <img width="2853" height="1546" alt="image" src="https://github.com/user-attachments/assets/a9a92d42-0780-4e5d-a731-468bf4300ebd" width="100%" />
      </td>
    </tr>
    <tr>
      <td width="50%">
       <img width="2867" height="1536" alt="image" src="https://github.com/user-attachments/assets/96957d13-9784-48e6-b69d-4f93a7498064" width="100%" />
      </td>
      <td width="50%">
        <img src="https://github.com/user-attachments/assets/f9b507fa-7088-465d-bc4f-e914c247c512" alt="Image 4" width="100%" />
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <img src="https://github.com/user-attachments/assets/4e794834-c3eb-48b9-87df-130041000c46" alt="Image 5" width="70%" />
      </td>
    </tr>
  </table>
</div>






## ✨ Features

### For All Users
- **Property Search**: Browse comprehensive property listings with detailed information
- **Advanced Filtering**: Find properties by category (Buy, Rent, Vacation), location, price range, and amenities
- **Favorites**: Save properties to revisit later
- **Enquiries**: Contact property owners directly through the platform
- **Interactive Maps**: Visualize property locations and explore neighborhoods

### For Registered Users
- **User Profiles**: Manage your personal information and preferences
- **Property Listings**: Create and manage your own property listings
- **Image Management**: Upload multiple high-quality photos via Cloudinary integration
- **Dashboard**: Track your property listings, saved favorites, and enquiries
- **Notifications**: Receive updates on your listings and enquiries

## 🛠️ Technology Stack

### Frontend
- **React**: Component-based UI library for building the user interface
- **TypeScript**: For type-safe code development
- **Vite**: Next-generation frontend tooling
- **Context API**: For state management across the application
- **Axios**: For API requests to the backend

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication

### Cloud Services
- **Cloudinary**: Cloud-based image and video management service
- **Vercel**: Deployment and hosting platform

## Getting Started

1. Folder structure:
   ```bash
      crestkeys/
      │
      ├── api/                      # Backend API source code
      │   ├── controllers/          # Controllers to handle business logic
      │   │   ├── auth.controller.ts
      │   │   ├── post.controller.ts
      │   │   ├── user.controller.ts
      │   │   └── verify.controller.ts
      │   │
      │   ├── middleware/           # Middleware for request validation and auth
      │   │   └── verifyToken.ts
      │   │
      │   ├── models/               # Mongoose models for database schemas
      │   │   ├── post.ts
      │   │   ├── postDetail.ts
      │   │   ├── savedPost.ts
      │   │   └── user.ts
      │   │
      │   ├── routes/               # API routes grouped by feature
      │   │   ├── auth.route.ts
      │   │   ├── post.route.ts
      │   │   ├── test.route.ts
      │   │   └── user.route.ts
      │   │
      │   ├── db.ts                 # MongoDB connection setup
      │   ├── index.ts              # Entry point for backend server
      │   └── types/express/        # Custom typings for Express (if any)
      │
      ├── estate/                   # Frontend React app (inside src)
      │   ├── assets/               # Images and static assets
      │   ├── components/           # React components organized by feature
      │   │   ├── card/
      │   │   ├── filter/
      │   │   ├── list/
      │   │   ├── map/
      │   │   ├── navbar/
      │   │   ├── pin/
      │   │   ├── searchbar/
      │   │   ├── slider/
      │   │   └── uploadWidget/
      │   │
      │   ├── context/              # React Contexts for state management (e.g. Auth)
      │   │   ├── AuthContext.ts
      │   │   └── AuthProvider.tsx
      │   │
      │   ├── lib/                  # Utility libraries (API requests, loaders, notifications)
      │   │   ├── ApiRequest.ts
      │   │   ├── Loaders.ts
      │   │   └── NotificationStore.ts
      │   │
      │   ├── routes/               # Page-level components (views)
      │   │   ├── HomePage/
      │   │   ├── RequireAuth.tsx   # Component to protect routes
      │   │   ├── about/
      │   │   ├── layout/
      │   │   ├── listPage/
      │   │   ├── login/
      │   │   ├── newPostPage/
      │   │   ├── profilePage/
      │   │   ├── profileUpdatePage/
      │   │   ├── register/
      │   │   └── singlePage/
      │   │
      │   ├── types.ts              # TypeScript types used in frontend
      │   ├── App.tsx               # Main React app component
      │   ├── main.tsx              # React app entry point
      │   ├── index.css             # Global styles
      │   └── vite.config.ts        # Vite config for frontend bundling
      │
      ├── estate/                   # (If used) possibly static content or deployment related
      ├── public/                   # Public static files (images, favicon, etc.)
      │
      ├── .gitignore                # Git ignore rules
      ├── README.md                 # This README file
      ├── package.json              # Project dependencies & scripts
      ├── tsconfig.json             # TypeScript config
      ├── vite.config.ts            # Vite configuration
      ├── vercel.json               # Vercel deployment config
      └── eslint.config.js          # ESLint rules for code linting




## 🔒 Authentication Flow

1. **Registration**:
   * User submits registration form with email, username, password
   * Backend validates the data and creates a new user account
   * JWT token is generated and returned to the client

2. **Login**:
   * User submits login credentials
   * Backend validates credentials and issues a JWT token
   * Token is stored in the client using Context API

3. **Protected Routes**:
   * JWT token is sent with each request to protected endpoints
   * Backend middleware verifies the token before processing requests
   * Unauthorized requests are rejected with appropriate error messages

## 📷 Image Upload

CrestKeys uses Cloudinary for image management:

1. User selects images for upload
2. Images are sent directly to Cloudinary via the frontend
3. Cloudinary returns image URLs after processing
4. URLs are saved in the database as part of the property listing

## 🌐 API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Log in an existing user

### Users
* `GET /api/users/profile` - Get user profile
* `PUT /api/users/profile` - Update user profile
* `GET /api/users/saved` - Get user's saved properties

### Properties
* `GET /api/posts` - Get all properties (with filters)
* `GET /api/posts/:id` - Get property details
* `POST /api/posts` - Create new property listing
* `PUT /api/posts/:id` - Update property listing
* `DELETE /api/posts/:id` - Delete property listing
* `POST /api/posts/:id/inquire` - Send inquiry about a property





