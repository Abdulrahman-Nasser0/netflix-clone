import './index.css'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import TVShows from './pages/TVShows'
import MoviesPage from './pages/MoviesPage'
import MyList from './pages/MyList'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    errorElement: <ErrorPage/>
  },
  {
    path: '/movies',
    element: <MoviesPage/>
  },
  {
    path: '/tv-shows',
    element: <TVShows/>
  },
  {
    path: '/my-list',
    element: <MyList/>
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
