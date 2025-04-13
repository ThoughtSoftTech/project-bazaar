/**
 * Helper function for making API calls
 */
interface ApiError extends Error {
  info?: any;
  status?: number;
}

// Base URL without the /api suffix
const BASE_URL = process.env.NODE_ENV === 'production'
  ? ''  // In production, we'll use relative URLs
  : 'http://localhost:3000';  // No trailing /api

export async function fetchAPI(endpoint: string, options = {}) {
  // Get auth token from localStorage (if it exists and we're in a browser environment)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if token exists
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    // Make sure we properly merge headers if options also contains headers
    headers: {
      ...defaultOptions.headers,
      ...(options as any)?.headers,
    }
  };

  // Clean the endpoint to ensure proper formatting
  let path = endpoint;
  // Remove /api/ prefix if it exists
  if (path.startsWith('/api/')) {
    path = path.substring(5);
  } else if (path.startsWith('api/')) {
    path = path.substring(4);
  }
  // Remove leading slash if any
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  // Construct the full URL with proper /api/ path
  const url = `${BASE_URL}/api/${path}`;

  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorMessage = `API error ${response.status}`;
      console.error(errorMessage, { url, status: response.status });
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}