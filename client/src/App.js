import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import './App.css';

import { io } from 'socket.io-client'

// import useGlobalErrorsHook from './hooks/useGlobalErrors';

import { FooterComponent } from './components/core/footer/Footer';
import { PageNotFound } from './components/core/page-not-found/PageNotFound';
import { LoadingSpinner } from './components/core/loadingSpinner/LoadingSpinner';

import { HomeComponent } from './components/home/Home'
const LazyGameComponent = lazy(() => import('./components/game/Game'))
const LazySettingsComponent = lazy(() => import('./components/settings/Settings'))

function App() {
  const [token, setToken] = useState(null)
  const [soundNotification, setSoundNotification] = useState(false)
  const [newNot, setNewNot] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef(null)



  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<HomeComponent fallback={<LoadingSpinner />} />} />

        <Route path='/game' element={<Suspense fallback={<LoadingSpinner />}><LazyGameComponent /></Suspense>} />

        <Route path='/settings' element={<Suspense fallback={<LoadingSpinner />}><LazySettingsComponent /></Suspense>} />

        {/* <Route path='/about' element={<Suspense fallback={<LoadingSpinner />}><LazyAboutComponent /></Suspense>} /> */}

        <Route path='*' element={<PageNotFound />} />

      </Routes>

      <FooterComponent />

    </div>
  );
}

export default App;
