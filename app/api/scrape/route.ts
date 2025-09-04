import { NextRequest, NextResponse } from 'next/server';
import { webScraperService } from '@/lib/web-scraper';

// POST /api/scrape - Scrape a website for rental listing information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape the website
    const scrapedData = await webScraperService.scrapeRentalListing(url);

    // Validate the scraped data
    if (!webScraperService.validateScrapedData(scrapedData)) {
      return NextResponse.json(
        { error: 'Failed to extract valid rental listing information' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scrapedData
    });
  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to scrape website',
        success: false
      },
      { status: 500 }
    );
  }
}

// GET /api/scrape?url=... - Scrape a website (alternative method)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape the website
    const scrapedData = await webScraperService.scrapeRentalListing(url);

    // Validate the scraped data
    if (!webScraperService.validateScrapedData(scrapedData)) {
      return NextResponse.json(
        { error: 'Failed to extract valid rental listing information' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scrapedData
    });
  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to scrape website',
        success: false
      },
      { status: 500 }
    );
  }
}