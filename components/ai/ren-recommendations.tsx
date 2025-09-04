"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { renAIService } from "@/lib/ai/ren-ai-service";
import { useSession } from "next-auth/react";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

export function RenRecommendations() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRecommendations();
    }
  }, [session]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API endpoint
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock recommendations
      const mockRecommendations: Listing[] = [
        {
          id: "1",
          title: "Canon EOS R5 Camera",
          description: "Professional mirrorless camera with 45MP sensor",
          price: 1200,
          location: "Makati City",
          images: ["/placeholder-camera.jpg"]
        },
        {
          id: "2",
          title: "Bosch Drill Set",
          description: "18V cordless drill with accessories",
          price: 350,
          location: "Quezon City",
          images: ["/placeholder-drill.jpg"]
        },
        {
          id: "3",
          title: "Mountain Bike",
          description: "Full suspension mountain bike, 29 inch wheels",
          price: 800,
          location: "Taguig City",
          images: ["/placeholder-bike.jpg"]
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">
            Recommended for You
          </span>
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            AI-Powered
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((listing) => (
              <div key={listing.id} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{listing.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium text-blue-600">₱{listing.price}/day</span>
                    <span className="text-xs text-gray-500">{listing.location}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No recommendations available. Start browsing to get personalized suggestions!
          </div>
        )}
      </CardContent>
    </Card>
  );
}