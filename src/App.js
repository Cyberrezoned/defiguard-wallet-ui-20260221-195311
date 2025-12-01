import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import './assets/css/responsive.css';
import './assets/css/style.css';

import Home from "./pages/home";
import Services from './pages/services';
import About from './pages/about';
import Features from './pages/features';
import Team from './pages/team';
import Blog from './pages/blog';
import Contact from './pages/contact';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

// <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

export default App;
