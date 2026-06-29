import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from "react-error-boundary";

import Navbar from './components/Navbar'
import Features from './components/Features'
import About from './components/About';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Loading from './pages/Loading';
import { PublicRoutes } from './routes/PublicRoutes';
import { ProtectedRoutes } from './routes/protectedRoutes';
import Dashboard from './pages/Dashboard';


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md m-4">
      <h2 className="text-lg font-bold">Upps! Signup screen mn koi masla aya hy.</h2>
      <p className="text-sm font-mono mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-3 px-4 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700"
      >
        Dobara Try Karo
      </button>
    </div>
  );
}


const App = () => {
  const navProp = [
    { item: 'Features', id: 'features' },
    { item: 'About', id: 'about' }
  ];
  const location = useLocation();
  const { loading, setLoading, user, setUser } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (location.pathname !== '/') return;
    const sections = ['features', 'about']
    const offset = 80

    const handleScroll = () => {


      const scrollY = window.scrollY

      sections.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return

        if (scrollY >= el.offsetTop - offset) {
          setActiveSection(id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)


    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  useEffect(() => {
    setLoading(true)
  }, [location.pathname])

  useEffect(() => {

    const handlePageLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    }
    if (document.readyState == 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
    }
    return () => window.removeEventListener('load', handlePageLoad)
  }, [setLoading, location.pathname])

  return (
    <div><ErrorBoundary>
      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: '#110E1F',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} />
      <AnimatePresence>
        {loading && <Loading />}
      </AnimatePresence>
      <Routes>
        <Route path='/' element={
          <main>
            <Navbar activeSection={activeSection} navList={navProp} />
            <Features />
            <About />
          </main>
        } />
        <Route path='/signup' element={<PublicRoutes><Signup /></PublicRoutes>} />
        <Route path='/login' element={<PublicRoutes><Login /></PublicRoutes>} />
        <Route path='/dashboard' element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
      </Routes></ErrorBoundary>
    </div>
  )
}

export default App