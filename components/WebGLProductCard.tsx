"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

interface WebGLProductCardProps {
  listing: {
    id: string
    title: string
    price: number
    location: string
    rating: number
    image: string
    category: string
  }
  onClick?: () => void
}

export function WebGLProductCard({ listing, onClick }: WebGLProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden group">
        <motion.div
          className="relative aspect-square overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={listing.image || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Badge className="bg-white/90 text-gray-800">
              ₱{listing.price.toLocaleString()}
            </Badge>
          </motion.div>
        </motion.div>
        
        <CardHeader className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{listing.rating}</span>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="secondary" className="text-xs">
              {listing.category}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}