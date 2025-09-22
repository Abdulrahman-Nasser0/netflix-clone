import "./index.css";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import MoviesPage from "./pages/MoviesPage";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import ComingSoonPage from "./pages/ComingSoonPage";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useMyList } from './stores/myListStore'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/movies",
    element: (
      <ProtectedRoute>
        <MoviesPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/tv-shows",
    element: (
      <ProtectedRoute>
        <TVShows />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/my-list",
    element: (
      <ProtectedRoute>
        <MyList />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/coming-soon",
    element: <ComingSoonPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  }
]);

function MyListSync() {
  // Keep My List in sync with auth state globally
  const { useSyncWithAuth } = useMyList()
  useSyncWithAuth()
  return null
}

function App() {
  return (
    <>
      <MyListSync />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
