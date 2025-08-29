import { imageService } from "./image-service"

export interface ProcessedImage {
  id: string
  url: string
  thumbnail: string
  width: number
  height: number
  format: string
  size: number
}

export interface ImageUploadOptions {
  maxSizeMB?: number
  allowedFormats?: string[]
  folder?: string
  maxFiles?: number
}

export class ImageUtils {
  // Process uploaded images for frontend display
  static processUploadedImages(images: any[]): ProcessedImage[] {
    return images.map(image => ({
      id: image.publicId || image.id,
      url: image.secureUrl || image.url,
      thumbnail: imageService.getThumbnailUrl(image.publicId || image.id),
      width: image.width,
      height: image.height,
      format: image.format,
      size: image.size
    }))
  }

  // Generate responsive image URLs
  static getResponsiveUrls(publicId: string): {
    thumbnail: string
    small: string
    medium: string
    large: string
    original: string
  } {
    return {
      thumbnail: imageService.getThumbnailUrl(publicId, 150),
      small: imageService.getOptimizedUrl(publicId, { width: 300, height: 200, crop: 'fill' }),
      medium: imageService.getOptimizedUrl(publicId, { width: 600, height: 400, crop: 'fill' }),
      large: imageService.getOptimizedUrl(publicId, { width: 1200, height: 800, crop: 'limit' }),
      original: imageService.getOptimizedUrl(publicId)
    }
  }

  // Validate file size and type on client side
  static validateFile(file: File, options: ImageUploadOptions = {}): {
    valid: boolean
    error?: string
  } {
    const {
      maxSizeMB = 5,
      allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    } = options

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      }
    }

    // Check file type
    if (!allowedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedFormats.join(', ')}`
      }
    }

    return { valid: true }
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Generate placeholder image URL
  static getPlaceholderUrl(width: number = 400, height: number = 300): string {
    return `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=No+Image`
  }

  // Check if image is loaded
  static async checkImageLoad(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  // Convert file to base64 for preview
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Calculate image dimensions maintaining aspect ratio
  static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight
    
    let width = maxWidth
    let height = maxWidth / aspectRatio
    
    if (height > maxHeight) {
      height = maxHeight
      width = maxHeight * aspectRatio
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  }
}

export const imageUtils = ImageUtils