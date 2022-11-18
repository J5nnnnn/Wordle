import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GameProvider } from './GameProvider';
import Welcome from './Welcome';
import Rule from './Rule';
import Normal from './Normal';
import Hard from './Hard';


const root = ReactDOM.createRoot(document.getElementById('root'));
const gameRouter = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/rules',
    element: <Rule />,
  },
  {
    path: '/game/normal',
    element: <Normal />,
  },
  {
    path: '/game/hard',
    element: <Hard />,
  }
])

root.render(
  // <React.StrictMode>
    <GameProvider>
      <RouterProvider router={gameRouter} />
    </GameProvider>
  /* </React.StrictMode> */
);
