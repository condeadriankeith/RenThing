import { v2 as cloudinary } from 'cloudinary'
import { put, del } from '@vercel/blob'
import { Readable } from 'stream'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface ImageUploadResult {
  publicId: string
  url: string
  secureUrl: string
  format: string
  width: number
  height: number
  size: number
  provider: 'cloudinary' | 'vercel-blob'
}

export interface ImageDeleteResult {
  result: string
}

class ImageService {
  private useBlob = !!process.env.BLOB_READ_WRITE_TOKEN

  // Upload image - automatically chooses provider based on configuration
  async uploadImage(
    file: Buffer,
    folder: string = 'listings',
    filename?: string
  ): Promise<ImageUploadResult> {
    if (this.useBlob) {
      return this.uploadToBlob(file, folder, filename)
    } else {
      return this.uploadToCloudinary(file, folder, filename)
    }
  }

  // Upload to Vercel Blob
  private async uploadToBlob(
    file: Buffer,
    folder: string,
    filename?: string
  ): Promise<ImageUploadResult> {
    const blobName = filename || `image-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const pathname = `${folder}/${blobName}`

    const blob = await put(pathname, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    return {
      publicId: blob.pathname,
      url: blob.url,
      secureUrl: blob.url,
      format: this.getFileExtension(blob.pathname),
      width: 0, // Blob doesn't provide image dimensions
      height: 0,
      size: file.length,
      provider: 'vercel-blob'
    }
  }

  // Upload to Cloudinary
  private async uploadToCloudinary(
    file: Buffer,
    folder: string = 'listings',
    filename?: string
  ): Promise<ImageUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `renthing/${folder}`,
          resource_type: 'auto',
          ...(filename && { public_id: filename }),
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              publicId: result.public_id,
              url: result.url,
              secureUrl: result.secure_url,
              format: result.format,
              width: result.width,
              height: result.height,
              size: result.bytes,
              provider: 'cloudinary'
            })
          }
        }
      )

      const readable = new Readable()
      readable.push(file)
      readable.push(null)
      readable.pipe(uploadStream)
    })
  }

  // Upload multiple images
  async uploadImages(
    files: Buffer[],
    folder: string = 'listings'
  ): Promise<ImageUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder))
    return Promise.all(uploadPromises)
  }

  // Delete image - handles both providers
  async deleteImage(publicId: string): Promise<ImageDeleteResult> {
    // Check if this is a Vercel Blob URL/path (contains folder structure)
    if (this.useBlob && publicId.includes('/')) {
      try {
        await del(publicId, { token: process.env.BLOB_READ_WRITE_TOKEN })
        return { result: 'ok' }
      } catch (error) {
        console.error('Blob deletion error:', error)
        throw error
      }
    } else {
      // Cloudinary deletion
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve({ result: result.result })
          }
        })
      })
    }
  }

  // Delete multiple images
  async deleteImages(publicIds: string[]): Promise<ImageDeleteResult[]> {
    const deletePromises = publicIds.map(publicId => this.deleteImage(publicId))
    return Promise.all(deletePromises)
  }

  // Generate optimized image URLs
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      crop?: string
      quality?: string
      format?: string
    } = {}
  ): string {
    const transformation = [
      ...(options.width || options.height ? [{ width: options.width, height: options.height, crop: options.crop || 'limit' }] : []),
      ...(options.quality ? [{ quality: options.quality }] : []),
      ...(options.format ? [{ fetch_format: options.format }] : [])
    ]

    return cloudinary.url(publicId, {
      secure: true,
      transformation
    })
  }

  // Get thumbnail URL
  getThumbnailUrl(publicId: string, size: number = 300): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill'
    })
  }

  // Validate image file
  validateImageFile(file: Buffer, maxSizeMB: number = 5): {
    valid: boolean
    error?: string
  } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.length > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      }
    }

    // Check if it's a valid image format by checking the first few bytes
    const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const header = file.slice(0, 4).toString('hex')

    const formatMap: { [key: string]: string } = {
      'ffd8ffe0': 'image/jpeg',
      'ffd8ffe1': 'image/jpeg',
      '89504e47': 'image/png',
      '52494646': 'image/webp',
      '47494638': 'image/gif'
    }

    const detectedFormat = formatMap[header.substring(0, 8)]

    if (!detectedFormat || !validFormats.includes(detectedFormat)) {
      return {
        valid: false,
        error: 'Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed'
      }
    }

    return { valid: true }
  }

  // Utility method to get file extension from filename/path
  private getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'unknown'
  }
}

export const imageService = new ImageService()