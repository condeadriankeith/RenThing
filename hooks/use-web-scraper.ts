import { useState, useCallback } from 'react';

interface ScrapedData {
  title: string;
  description: string;
  price?: number;
  location?: string;
  images: string[];
  features: string[];
  url: string;
}

interface ScrapeResult {
  data?: ScrapedData;
  loading: boolean;
  error?: string;
}

export function useWebScraper() {
  const [result, setResult] = useState<ScrapeResult>({
    loading: false,
    data: undefined,
    error: undefined
  });

  const scrapeUrl = useCallback(async (url: string) => {
    try {
      setResult({ loading: true, data: undefined, error: undefined });

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape website');
      }

      setResult({
        loading: false,
        data: data.data,
        error: undefined
      });

      return data.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scrape website';
      setResult({
        loading: false,
        data: undefined,
        error: errorMessage
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setResult({
      loading: false,
      data: undefined,
      error: undefined
    });
  }, []);

  return {
    ...result,
    scrapeUrl,
    reset
  };
}