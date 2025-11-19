'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/app/components/AuthProvider'
import Link from 'next/link'

interface ProblemWithPerspectives {
  id: string
  title: string
  description: string
  category: string
  created_at: string
  perspectives: any[]
  user: {
    username: string
  }
}

export default function InsightsLibrary() {
  const { user } = useAuth() as any
  const [problems, setProblems] = useState<ProblemWithPerspectives[]>([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    const { data, error } = await supabase
      .from('problems')
      .select(`
        *,
        perspectives(*),
        profiles:user_id(username)
      `)
      .order('created_at', { ascending: false })

    if (data) {
      const formattedData = data.map(problem => ({
        ...problem,
        user: { username: problem.profiles?.username || 'Usuario' }
      }))
      setProblems(formattedData)
    }
  }

  const filteredProblems = problems.filter(problem => {
    const matchesFilter = filter === 'all' || problem.category === filter
    const title = (problem.title || '').toLowerCase()
    const description = (problem.description || '').toLowerCase()
    const term = searchTerm.toLowerCase()
    const matchesSearch = title.includes(term) || description.includes(term)
    return matchesFilter && matchesSearch
  })

  const categories = ['all', ...Array.from(new Set(problems.map(p => p.category)))]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Biblioteca de Insights
        </h1>
        <p className="text-xl text-gray-600">
          Explora problemas y soluciones desde múltiples perspectivas
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar problemas o insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de problemas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map(problem => (
          <Link 
            key={problem.id} 
            href={`/perspective-exchange?problem=${problem.id}`}
            className="block"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                  {problem.category}
                </span>
                <span className="text-sm text-gray-500">
                  {problem.perspectives.length} persp.
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {problem.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {problem.description}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Por {problem.user.username}</span>
                <span>
                  {new Date(problem.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No se encontraron problemas
          </div>
          <Link 
            href="/problem-submit"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
          >
            Crear Primer Problema
          </Link>
        </div>
      )}
    </div>
  )
}