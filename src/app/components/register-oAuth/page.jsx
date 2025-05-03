'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import Layout2 from '@/components/layout2'

export default function RegisterOAuthPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const webToken = params.get('webToken')
    const refreshWebToken = params.get('refreshWebToken')
    if (webToken && refreshWebToken) {
      localStorage.setItem('token', webToken)
      localStorage.setItem('refreshToken', refreshWebToken)
      window.history.replaceState({}, '', '/')
      router.push('/components/home_logged')
    }
  }, [router])

  const onGoogleSuccess = async ({ credential }) => {
    if (!credential) {
      setError('No se recibió credencial de Google')
      return
    }
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/google/web/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error en login con Google')

      localStorage.setItem('token', data.webToken)
      localStorage.setItem('refreshToken', data.refreshWebToken)
      router.push('/components/home_logged')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      autoSelect={false}
    >
      <Layout2>
        <div className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-128px)]">
          <h1 className="mb-4 text-2xl font-semibold">Regístrate con Google</h1>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => setError('Error al iniciar sesión con Google')}
            prompt="select_account"
          />
        </div>
      </Layout2>
    </GoogleOAuthProvider>
  )
}