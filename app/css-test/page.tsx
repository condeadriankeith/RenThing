"use client"

import Link from "next/link"

export default function CSSTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          CSS Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Tailwind CSS Test</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you can see styled elements below, Tailwind CSS is working correctly.
            </p>
            
            <div className="space-y-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Blue Button
              </button>
              
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Green Button
              </button>
              
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  This is a warning box with yellow background
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Custom Classes Test</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Testing custom classes defined in globals.css
            </p>
            
            <div className="space-y-4">
              <div className="p-responsive bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  This uses the .p-responsive utility class
                </p>
              </div>
              
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <p>
                  This uses the card color variables
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}