'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/app/components/AuthProvider'
import { useSearchParams } from 'next/navigation'

interface Problem {
  id: string
  title: string
  description: string
  requested_roles: string[]
}

interface Perspective {
  id: string
  problem_id: string
  role: string
  content: string
  created_by: string
  created_at: string
}

const ROLE_DESCRIPTIONS = {
  'Filósofo': 'Analiza desde conceptos fundamentales y cuestionamientos profundos',
  'Ingeniero': 'Enfocado en soluciones prácticas y sistemáticas',
  'Artista': 'Perspectiva creativa y fuera de lo convencional',
  'Científico': 'Enfoque metódico basado en evidencia y experimentación',
  'Empresario': 'Visión estratégica y orientada a resultados',
  'Psicólogo': 'Comprensión del comportamiento y emociones humanas',
  'Escritor': 'Narrativa y comunicación efectiva de ideas',
  'Deportista': 'Mentalidad de disciplina y superación personal'
}

export default function PerspectiveExchange() {
  const { user } = useAuth() as any
  const searchParams = useSearchParams()
  const problemId = searchParams.get('problem')
  
  const [problem, setProblem] = useState<Problem | null>(null)
  const [perspectives, setPerspectives] = useState<Perspective[]>([])
  const [currentRole, setCurrentRole] = useState('')
  const [perspectiveContent, setPerspectiveContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)

  useEffect(() => {
    if (problemId) {
      fetchProblem()
      fetchPerspectives()
    }
  }, [problemId])

  const fetchProblem = async () => {
    const { data } = await supabase
      .from('problems')
      .select('*')
      .eq('id', problemId)
      .single()
    
    if (data) {
      setProblem(data)
      setCurrentRole(data.requested_roles[0])
    }
  }

  const fetchPerspectives = async () => {
    const { data } = await supabase
      .from('perspectives')
      .select('*')
      .eq('problem_id', problemId)
      .order('created_at', { ascending: true })
    
    if (data) setPerspectives(data)
  }

  const generateAIPerspective = async (role: string) => {
    setGeneratingAI(true)
    
    // Simulación de generación de perspectiva IA
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        'Filósofo': `Como filósofo, reflexiono sobre la naturaleza fundamental de este desafío. ¿Qué valores están en juego? ¿Qué significa el éxito en este contexto? La verdadera pregunta podría ser más profunda de lo que parece...`,
        'Ingeniero': `Analizando el problema sistemáticamente. Propongo descomponerlo en componentes manejables, identificar puntos de falla y diseñar una solución escalable. La eficiencia es clave.`,
        'Artista': `Veo este problema como una oportunidad creativa. ¿Has considerado abordarlo desde un ángulo completamente diferente? La belleza está en la perspectiva inusual...`
      }
      
      const newPerspective: Perspective = {
        id: `ai-${Date.now()}`,
        problem_id: problemId!,
        role,
        content: aiResponses[role] || `Como ${role.toLowerCase()} veo este desafío desde mi experiencia única...`,
        created_by: 'ai',
        created_at: new Date().toISOString()
      }
      
      setPerspectives(prev => [...prev, newPerspective])
      setGeneratingAI(false)
    }, 2000)
  }

  const submitPerspective = async () => {
    if (!perspectiveContent.trim() || !currentRole) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('perspectives')
        .insert([{
          problem_id: problemId,
          role: currentRole,
          content: perspectiveContent,
          created_by: user.id
        }])
        .select()

      if (error) throw error

      if (data) {
        setPerspectives(prev => [...prev, data[0]])
        setPerspectiveContent('')
      }
    } catch (error) {
      console.error('Error submitting perspective:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!problem) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Problema y roles */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {problem.title}
            </h2>
            <p className="text-gray-600 mb-4 whitespace-pre-line">
              {problem.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {problem.requested_roles.map(role => (
                <span
                  key={role}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4">
              Añadir Perspectiva
            </h3>
            
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            >
              {problem.requested_roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
              {ROLE_DESCRIPTIONS[currentRole as keyof typeof ROLE_DESCRIPTIONS]}
            </div>

            <textarea
              value={perspectiveContent}
              onChange={(e) => setPerspectiveContent(e.target.value)}
              placeholder={`Escribe tu perspectiva como ${currentRole.toLowerCase()}...`}
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={submitPerspective}
                disabled={loading || !perspectiveContent.trim()}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Contribuir'}
              </button>
              
              <button
                onClick={() => generateAIPerspective(currentRole)}
                disabled={generatingAI}
                className="px-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {generatingAI ? '...' : 'IA'}
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha - Perspectivas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Perspectivas ({perspectives.length})
            </h3>
            
            <div className="space-y-6">
              {perspectives.map((perspective) => (
                <div key={perspective.id} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-purple-700">
                      {perspective.role}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(perspective.created_at).toLocaleDateString()}
                    </span>
                    {perspective.created_by === 'ai' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        IA
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {perspective.content}
                  </p>
                </div>
              ))}
              
              {perspectives.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Sé el primero en aportar una perspectiva
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}