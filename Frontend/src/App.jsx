import React from 'react'
import { rout } from './Routes.jsx';
import { RouterProvider } from 'react-router';
import {AuthProvider} from './features/auth/auth.context.jsx';
import {InterviewProvider} from './features/interview/Interview.context.jsx'
const App = () => {
  return (
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={rout} />
        </InterviewProvider>
      </AuthProvider>
  )
}

export default App
