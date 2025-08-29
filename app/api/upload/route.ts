import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { imageService } from "@/lib/image-service"

// POST /api/upload - Upload images for listings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'listings'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      )
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Validate file
      const validation = imageService.validateImageFile(buffer)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Upload to Cloudinary
      return imageService.uploadImage(buffer, folder)
    })

    const results = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      images: results.map(result => ({
        publicId: result.publicId,
        url: result.secureUrl,
        thumbnail: imageService.getThumbnailUrl(result.publicId),
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.size
      }))
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete images
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { publicIds } = await request.json()

    if (!publicIds || !Array.isArray(publicIds)) {
      return NextResponse.json(
        { error: "Invalid public IDs provided" },
        { status: 400 }
      )
    }

    const results = await imageService.deleteImages(publicIds)

    return NextResponse.json({
      success: true,
      deleted: results.length,
      results
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    )
  }
}