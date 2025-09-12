"use client";

import { UrlScraper } from "@/components/url-scraper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ScrapePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Import Rental Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Enter the URL of a rental listing to import it into RenThing. This feature allows you to quickly 
            extract information from external rental platforms and create listings in our marketplace.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How it works:</h3>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1 text-sm">
              <li>Enter a URL of a rental listing from any website</li>
              <li>Our system will extract key information like title, description, price, and images</li>
              <li>Review the extracted data and make any necessary adjustments</li>
              <li>Create a new listing in RenThing with the imported information</li>
            </ul>
          </div>
          
          <UrlScraper />
        </CardContent>
      </Card>
    </div>
  );
}