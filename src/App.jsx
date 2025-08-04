import "./index.css";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import MoviesPage from "./pages/MoviesPage";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Register from "./pages/Register";
import Login from "./pages/Login";
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
    element: <MoviesPage />,
  },
  {
    path: "/tv-shows",
    element: <TVShows />,
  },
  {
    path: "/my-list",
    element: <MyList />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
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
