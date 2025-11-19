'use client'
import { useAuth } from '@/app/components/AuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth() as any
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    problemsPosted: 0,
    perspectivesGiven: 0
  })

  useEffect(() => {
    if (user) fetchUserStats()
  }, [user])

  const fetchUserStats = async () => {
    // Obtener estadísticas del usuario
    const { count: problemsCount } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { count: perspectivesCount } = await supabase
      .from('perspectives')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)

    setUserStats({
      problemsPosted: problemsCount || 0,
      perspectivesGiven: perspectivesCount || 0
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              MindSwap Dashboard
            </h1>
            <p className="text-gray-600">
              Intercambia perspectivas, expande tu mente
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {userStats.problemsPosted}
            </div>
            <div className="text-gray-600">Problemas Publicados</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {userStats.perspectivesGiven}
            </div>
            <div className="text-gray-600">Perspectivas Contribuidas</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {userStats.problemsPosted + userStats.perspectivesGiven}
            </div>
            <div className="text-gray-600">Total de Contribuciones</div>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/problem-submit" className="block">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Compartir Problema
              </h3>
              <p className="text-gray-600">
                Describe tu desafío y elige las perspectivas que necesitas
              </p>
            </div>
          </Link>

          <Link href="/perspective-exchange" className="block">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Intercambiar Perspectivas
              </h3>
              <p className="text-gray-600">
                Ayuda a otros viendo sus problemas desde diferentes roles
              </p>
            </div>
          </Link>

          <Link href="/insights-library" className="block">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Biblioteca de Insights
              </h3>
              <p className="text-gray-600">
                Explora problemas y soluciones de la comunidad
              </p>
            </div>
          </Link>
        </div>

        {/* Problemas recientes */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Problemas Recientes de la Comunidad
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-center py-8">
              Explora problemas interesantes en la Biblioteca de Insights
            </p>
            <div className="text-center">
              <Link 
                href="/insights-library"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
              >
                Explorar Biblioteca
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}