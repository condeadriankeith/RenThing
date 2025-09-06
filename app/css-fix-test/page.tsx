"use client"

export default function CSSFixTestPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          CSS Fix Test
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-medium">
              If this has a green background and padding, Tailwind is working!
            </p>
          </div>
          
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-red-800 font-medium">
              If this has a red background and padding, Tailwind is working!
            </p>
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Blue Button
          </button>
          
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Purple Button
          </button>
        </div>
      </div>
    </div>
  )
}