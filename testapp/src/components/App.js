import React from 'react';
import '../styles/App.css';
import{ createBrowserRouter,RouterProvider } from 'react-router-dom'
import Main from './Main';
import FinishPage from './FinishPage';
import TestPage from './TestPage';





const router = createBrowserRouter([
  {
  path:'/',
  element: <Main></Main>
  },
  {
    path:'/test',
    element: <TestPage></TestPage>
    },
    {
      path:'/finish',
      element: <FinishPage></FinishPage>
      },
])
function App() {
  return (
   <>
   <RouterProvider router={router}/>
   </>
  );
}

export default App;
