import needle, { NeedleResponse, NeedleOptions } from "needle";

export type HttpClientOptions = NeedleOptions;
/**
 * HTTP Client using needle library
 */
export class HttpClient {
  private baseUrl: string;
  private defaultOptions: NeedleOptions;

  /**
   * Creates a new HttpClient instance
   *
   * @param baseUrl - The base URL for all requests
   * @param defaultOptions - Default options to apply to all requests
   */
  constructor(baseUrl: string, defaultOptions: NeedleOptions = {}) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultOptions = {
      json: true,
      timeout: 10000,
      ...defaultOptions,
    };
  }

  /**
   * Makes a GET request to the specified endpoint
   *
   * @param endpoint - The API endpoint to call
   * @param params - Optional query parameters
   * @param options - Optional needle options to override defaults
   * @returns Promise with the response data
   */
  public async get<T = any>(
    endpoint: string,
    params: Record<string, any> = {},
    options: NeedleOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const mergedOptions: NeedleOptions = {
      ...this.defaultOptions,
      ...options,
    };

    try {
      const response: NeedleResponse = await needle(
        "get",
        url,
        params,
        mergedOptions
      );
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, "GET", endpoint);
    }
  }

  /**
   * Makes a POST request to the specified endpoint
   *
   * @param endpoint - The API endpoint to call
   * @param data - The request body
   * @param options - Optional needle options to override defaults
   * @returns Promise with the response data
   */
  public async post<T = any>(
    endpoint: string,
    data: Record<string, any> = {},
    options: NeedleOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const mergedOptions: NeedleOptions = {
      ...this.defaultOptions,
      ...options,
    };

    try {
      const response: NeedleResponse = await needle(
        "post",
        url,
        data,
        mergedOptions
      );
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error, "POST", endpoint);
    }
  }

  /**
   * Builds the complete URL for a request
   *
   * @param endpoint - The API endpoint
   * @returns The complete URL
   */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
  }

  /**
   * Handles the API response
   *
   * @param response - The needle response object
   * @returns The parsed response body
   */
  private handleResponse<T>(response: NeedleResponse): T {
    if (
      response.statusCode &&
      response.statusCode >= 200 &&
      response.statusCode < 300
    ) {
      return response.body as T;
    }

    throw new HttpError(
      response.statusCode || 500,
      typeof response.body === "object" && response.body?.message
        ? response.body.message
        : "Request failed",
      response
    );
  }

  /**
   * Handles request errors
   *
   * @param error - The caught error
   * @param method - The HTTP method that was used
   * @param endpoint - The endpoint that was called
   * @returns A standardized HttpError
   */
  private handleError(error: any, method: string, endpoint: string): HttpError {
    if (error instanceof HttpError) {
      return error;
    }

    const message = `${method} request to ${endpoint} failed: ${
      error.message || "Unknown error"
    }`;
    return new HttpError(500, message, error);
  }
}

/**
 * Custom HTTP error class
 */
export class HttpError extends Error {
  statusCode: number;
  originalError: any;

  constructor(statusCode: number, message: string, originalError: any) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}
