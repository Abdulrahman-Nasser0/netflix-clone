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
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { MyListProvider } from './contexts/MyListContext';

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
]);

function App() {
  return (
    <AuthProvider>
      <MyListProvider>
        <RouterProvider router={router} />
      </MyListProvider>
    </AuthProvider>
  );
}

export default App;
