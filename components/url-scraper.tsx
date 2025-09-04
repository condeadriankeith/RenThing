"use client";

import { useState } from "react";
import { useWebScraper } from "@/hooks/use-web-scraper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link } from "lucide-react";
import { SpinnerLoader } from "@/components/ui/spinner-loader";

interface ScrapedData {
  title: string;
  description: string;
  price?: number;
  location?: string;
  images: string[];
  features: string[];
  url: string;
}

export function UrlScraper() {
  const [url, setUrl] = useState("");
  const { scrapeUrl, loading, data, error, reset } = useWebScraper();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    try {
      await scrapeUrl(url);
    } catch (err) {
      // Error is handled in the hook
      console.error("Scraping failed:", err);
    }
  };

  const handleReset = () => {
    setUrl("");
    reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            URL Scraper
          </CardTitle>
          <CardDescription>
            Enter a URL to extract rental listing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/rental-listing"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || !url}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Scrape URL
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="flex flex-col items-center space-y-2">
            <SpinnerLoader size="lg" className="text-blue-500" />
            <p className="text-gray-600 dark:text-gray-400">Scraping website...</p>
          </div>
        </div>
      )}

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Scraped Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{data.title}</h3>
              <p className="text-sm text-gray-500">{data.url}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-700 dark:text-gray-300">{data.description}</p>
            </div>
            
            {data.price && (
              <div>
                <h4 className="font-medium">Price</h4>
                <p className="text-lg font-semibold">₱{data.price.toLocaleString()}</p>
              </div>
            )}
            
            {data.location && (
              <div>
                <h4 className="font-medium">Location</h4>
                <p>{data.location}</p>
              </div>
            )}
            
            {data.features.length > 0 && (
              <div>
                <h4 className="font-medium">Features</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {data.images.length > 0 && (
              <div>
                <h4 className="font-medium">Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {data.images.slice(0, 6).map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`Scraped image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}