# 🍿 Netflix Clone

![Netflix Clone Banner](public/images/netflix-logo.png)

A modern, responsive Netflix clone built with React and Laravel, leveraging the power of TMDB API to deliver a seamless streaming platform experience. This full-stack application features user authentication, personalized watchlists, and real-time movie data.

[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-yellow)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38B2AC)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-12.0-red)](https://laravel.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Features

- 🎬 Browse trending movies and TV shows
- 📺 View detailed information about movies and shows
- 🔍 Search functionality for finding specific content
- 📱 Responsive design that works on all devices
- 👤 User authentication system
- 📋 Personal watchlist management
- 🎭 Category filtering for different genres
- 🖼️ Movie title overlays for better content identification

## 🚀 Live Demo

Check out the live demo at [Netflix-Clone](https://netflix-clone-demo.example.com)

## 📸 Screenshots

### 🖥️ Desktop View

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
  <img src="public/readme/Screenshot from 2025-08-11 15-12-12.png" alt="Home Page" width="400"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-12-24.png" alt="Movie Details" width="400"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-12-40.png" alt="Browse Page" width="400"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-13-31.png" alt="My List" width="400"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-13-52.png" alt="Account Settings" width="400"/>
   <img src="public/readme/Screenshot from 2025-08-11 15-19-16.png" alt="Movie Modal" width="400"/>
</div>

### 📱 Mobile View

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
  <img src="public/readme/Screenshot from 2025-08-11 15-14-22.png" alt="Mobile Home" width="200"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-15-01.png" alt="Mobile Navigation" width="200"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-15-11.png" alt="Mobile Details" width="200"/>
</div>

### 🎬 Movie Card Detail

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="public/readme/Screenshot from 2025-08-11 15-15-18.png" alt="Movie Card Hover" width="300"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-15-24.png" alt="Movie Card Detail" width="300"/>
  <img src="public/readme/Screenshot from 2025-08-11 15-17-26.png" alt="Movie Modal" width="300"/>
</div>

## 🛠️ Technologies Used

- **Frontend Framework:** React 19
- **Backend Framework:** Laravel 12
- **Build Tool:** Vite 7
- **Styling:** TailwindCSS 4
- **Routing:** React Router DOM 7
- **Icons:** React Icons 5
- **API Client:** Axios
- **Testing:** Cypress
- **State Management:** Context API & React Query

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdulrahman-Nasser0/netflix-clone.git
   cd netflix-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   VITE_BACKEND_API_URL=your_backend_url_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

This project uses Cypress for end-to-end testing:

```bash
# Open Cypress Test Runner
npm run cy:open

# Run tests in headless mode
npm run cy:run
```

## 📂 Project Structure

```
netflix-clone/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts for state management
│   ├── hooks/           # Custom hooks
│   ├── models/          # Data models
│   ├── pages/           # Application pages
│   ├── services/        # API services
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── cypress/             # E2E tests
└── ...config files
```

## 🔄 API Integration

The application integrates with The Movie Database (TMDB) API to fetch movie and TV show data, while the Laravel backend handles user authentication, favorites management, and other persistent data. You'll need an API key from [TMDB](https://www.themoviedb.org/documentation/api) to run this project locally.

## 💡 About the Project

This Netflix Clone was developed over approximately 15 days as a collaborative project. The frontend was built by me (Abdulrahman Nasser), while the backend implementation was developed by my collaborator Mina using Laravel.

### 🛠️ Technical Stack Overview

- **Frontend**: React with Vite, TailwindCSS, React Router, and Context API for state management
- **Backend**: Laravel REST API with MySQL database, deployed on Railway
- **External APIs**: TMDB API for movie and TV show data
- **Testing**: Cypress for end-to-end tests

### 🧠 Development Journey & Challenges

Throughout the development of this project, I faced several challenges that helped me grow as a developer:

1. **Complex API Integration**: The most significant challenge was implementing the favorites system. It required storing TMDB IDs in our database and then re-fetching detailed content information from TMDB when displaying user favorites - an intricate dance between our backend and the external API.

2. **State Management**: Maintaining consistent state across the application while handling asynchronous API calls required careful implementation of React's Context API and custom hooks.

3. **Responsive Design**: Recreating Netflix's sleek UI with proper responsiveness across all devices required meticulous attention to detail with TailwindCSS.

4. **Authentication Flow**: Implementing a secure and user-friendly authentication system that works seamlessly with the Laravel backend required solving several CORS and token management challenges.

5. **Movie Carousel Implementation**: Creating smooth, performant carousels for movie browsing that matched Netflix's behavior was particularly challenging.

Through overcoming these challenges, I gained significant experience in:
- Working with external APIs and handling their limitations
- Building robust authentication systems
- Creating reusable component libraries
- Implementing complex UI patterns
- Collaborating on full-stack applications with separated frontend and backend concerns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the API
- [Netflix](https://netflix.com) for the design inspiration
- All the open-source libraries used in this project
- [Railway](https://railway.app/) for hosting the backend

## �‍💻 Contributors

- **Frontend Development**: [Abdulrahman Nasser](https://github.com/Abdulrahman-Nasser0)
- **Backend Development**: [Mina](https://github.com/your-friends-username) - Implemented the Laravel backend API, database design, authentication system, and favorites management

## 🔗 Related Projects

- [Netflix Clone Backend](https://github.com/your-friends-username/netflix-clone-backend) - Laravel API powering this application

## �📬 Contact

Abdulrahman Nasser - [@your_twitter](https://twitter.com/your_twitter) - your.email@example.com

Project Link: [https://github.com/Abdulrahman-Nasser0/netflix-clone](https://github.com/Abdulrahman-Nasser0/netflix-clone)

---

<p align="center">Made with ❤️ by Abdulrahman Nasser and Mina</p>
