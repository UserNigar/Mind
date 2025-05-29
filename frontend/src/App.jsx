import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Navlist from './components/headercomponent/navlist/Navlist.jsx';
import './App.css';
import Home from './components/pages/Home.jsx';
import CustomizedSwitch from './components/sidebarcomp/Nightbtn/Night.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<Home/>

          
        }
      ]
    },
    
  ]);

  return (
<>
    <RouterProvider router={router}>
      <CustomizedSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
      <Navlist darkMode={darkMode} />
     </RouterProvider>
</>
  );
}

export default App;
