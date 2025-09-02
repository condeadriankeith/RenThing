"use client"

import { useEffect } from 'react'

// Component to clean up browser extension attributes that cause hydration issues
export default function BrowserExtensionCleanup() {
  useEffect(() => {
    // Function to clean up extension attributes
    const cleanupExtensionAttributes = () => {
      if (typeof window !== 'undefined' && document.body) {
        // Remove Grammarly attributes
        document.body.removeAttribute('data-new-gr-c-s-check-loaded')
        document.body.removeAttribute('data-gr-ext-installed')
        
        // Remove other common extension attributes
        document.body.removeAttribute('data-gramm')
        document.body.removeAttribute('data-gramm_editor')
        document.body.removeAttribute('spellcheck')
        
        // Clean up any other common extension-added attributes
        const body = document.body
        for (let i = body.attributes.length - 1; i >= 0; i--) {
          const attr = body.attributes[i]
          if (attr.name.startsWith('data-') && 
              (attr.name.includes('gr-') || 
               attr.name.includes('gramm') ||
               attr.name.includes('extension') ||
               attr.name.includes('ext-'))) {
            body.removeAttribute(attr.name)
          }
        }
      }
    }

    // Clean up immediately
    cleanupExtensionAttributes()
    
    // Clean up after a short delay (for extensions that inject late)
    const timeout = setTimeout(cleanupExtensionAttributes, 500)
    
    // Set up a mutation observer to clean up any new attributes
    let observer: MutationObserver | null = null
    
    if (typeof window !== 'undefined' && window.MutationObserver) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.target === document.body) {
            const attributeName = mutation.attributeName
            if (attributeName && 
                (attributeName.includes('gr-') || 
                 attributeName.includes('gramm') ||
                 attributeName.includes('extension') ||
                 attributeName.includes('ext-'))) {
              document.body.removeAttribute(attributeName)
            }
          }
        })
      })
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: [],
        attributeOldValue: false
      })
    }
    
    return () => {
      clearTimeout(timeout)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  return null // This component doesn't render anything
}