import './globals.css'
import { AuthProvider } from './components/AuthProvider'

export const metadata = {
  title: 'MindSwap - Intercambia Perspectivas',
  description: 'Resuelve problemas desde múltiples perspectivas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-purple-50 to-blue-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}