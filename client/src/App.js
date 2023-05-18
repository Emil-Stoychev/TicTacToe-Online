import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react';
import './App.css';

import { io } from 'socket.io-client'

// import useGlobalErrorsHook from './hooks/useGlobalErrors';


import { FooterComponent } from './components/core/footer/Footer';
import { PageNotFound } from './components/core/page-not-found/PageNotFound';
import { LoadingSpinner } from './components/core/loadingSpinner/LoadingSpinner';

import { HomeComponent } from './components/home/Home'
import { AuthContext } from './context/UserContext';

const LazyGameComponent = lazy(() => import('./components/game/Game'))
const LazySettingsComponent = lazy(() => import('./components/core/settings/Settings'))
const LazyAboutComponent = lazy(() => import('./components/core/about/About'))

function App() {
  let { user, setUser } = useContext(AuthContext)

  const [onlineUsers, setOnlineUsers] = useState([])
  const [onlineGames, setOnlineGames] = useState([])
  const socket = useRef(null)

  useEffect(() => {
    if (user?.token != null) {
      socket.current = io(`http://${window.location.hostname}:3060`)
      socket.current?.emit("newUser", user)
      socket.current?.on('get-users', (users) => {
        setOnlineUsers(users)
      })
      socket.current?.on('get-allGames', (games) => {
        setOnlineGames(games)
      })

      return () => {
        socket.current.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    console.log('<>ONLINE USERS<>');
    console.log(onlineUsers);
  }, [onlineUsers])

  useEffect(() => {
    console.log('<>ONLINE GAMES<>');
    console.log(onlineGames);
  }, [onlineGames])

  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<HomeComponent fallback={<LoadingSpinner />}
          socket={socket}
          setOnlineUsers={setOnlineUsers}
          onlineUsers={onlineUsers}
          onlineGames={onlineGames}
          setOnlineGames={setOnlineGames}
        />} />

        <Route path='/game/:gameId' element={<Suspense fallback={<LoadingSpinner />}><LazyGameComponent socket={socket} /></Suspense>} />

        <Route path='/settings' element={<Suspense fallback={<LoadingSpinner />}><LazySettingsComponent /></Suspense>} />

        <Route path='/about' element={<Suspense fallback={<LoadingSpinner />}><LazyAboutComponent /></Suspense>} />

        <Route path='*' element={<PageNotFound />} />

      </Routes>

      <FooterComponent />
    </div>
  );
}

export default App;
