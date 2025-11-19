import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            MindSwap
          </div>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-gray-200 transition"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Intercambia 
            <span className="block text-yellow-300">Perspectivas</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Resuelve problemas creativamente viéndolos desde múltiples roles. 
            Filósofos, ingenieros, artistas y más te ayudarán a encontrar soluciones innovadoras.
          </p>
          <div className="space-x-4">
            <Link 
              href="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}