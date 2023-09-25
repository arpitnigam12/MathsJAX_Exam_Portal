import React from 'react';
import '../styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './Main';
import FinishPage from './FinishPage';
import TestPage from './TestPage';
import { MathJaxContext } from 'better-react-mathjax'; // Import MathJaxContext

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main></Main>
  },
  {
    path: '/test',
    element: <TestPage></TestPage>
  },
  {
    path: '/finish',
    element: <FinishPage></FinishPage>
  },
]);

function App() {
  return (
    <MathJaxContext version={3}> {/* Wrap your RouterProvider with MathJaxContext */}
      <RouterProvider router={router} />
    </MathJaxContext>
  );
}

export default App;
