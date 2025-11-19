'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/app/components/AuthProvider'
import { useRouter } from 'next/navigation'

const PROBLEM_CATEGORIES = [
  'Personal',
  'Profesional',
  'Relacional',
  'Creativo',
  'Tecnológico',
  'Existencial'
]

const SUGGESTED_ROLES = [
  'Filósofo',
  'Ingeniero',
  'Artista',
  'Científico',
  'Empresario',
  'Psicólogo',
  'Escritor',
  'Deportista'
]

export default function ProblemSubmit() {
  const { user } = useAuth() as any
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Personal')
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Filósofo', 'Ingeniero'])
  const [loading, setLoading] = useState(false)

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const submitProblem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || selectedRoles.length === 0) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('problems')
        .insert([{
          user_id: user.id,
          title,
          description,
          category,
          requested_roles: selectedRoles,
          status: 'active'
        }])
        .select()

      if (error) throw error

      if (data) {
        router.push(`/perspective-exchange?problem=${data[0].id}`)
      }
    } catch (error) {
      console.error('Error submitting problem:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Comparte tu Desafío
        </h1>
        <p className="text-xl text-gray-600">
          Describe tu problema y elige las perspectivas que quieres explorar
        </p>
      </div>

      <form onSubmit={submitProblem} className="space-y-6 bg-white rounded-2xl p-8 shadow-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del problema
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: ¿Cómo puedo mejorar mi productividad?"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {PROBLEM_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción detallada
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe tu problema en detalle. Sé específico sobre el contexto, lo que has intentado y qué resultado esperas..."
            rows={6}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Selecciona perspectivas (mínimo 2)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUGGESTED_ROLES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedRoles.includes(role)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <span className="text-sm text-gray-500">
            {selectedRoles.length} perspectivas seleccionadas
          </span>
          <button
            type="submit"
            disabled={loading || selectedRoles.length < 2}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Obtener Perspectivas'}
          </button>
        </div>
      </form>
    </div>
  )
}