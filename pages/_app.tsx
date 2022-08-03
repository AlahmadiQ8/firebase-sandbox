import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import {useAuthState} from 'react-firebase-hooks/auth'
import { UserContext } from '../lib/context'
import { auth } from '../lib/firebase'
import { useEffect, useState } from 'react'
import { useUserData } from '../lib/hooks'

function MyApp({ Component, pageProps }: AppProps) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
