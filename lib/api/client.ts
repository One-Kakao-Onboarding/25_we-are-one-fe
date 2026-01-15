export class ApiError extends Error {
    constructor(public status: number, public message: string, public data?: any) {
        super(message);
        this.name = 'ApiError';
    }
}

const BASE_URL = ''; // Proxied by Next.js

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

async function fetchJson<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    // URL configurations
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...init.headers,
    };

    const response = await fetch(url, {
        ...init,
        headers,
    });

    if (!response.ok) {
        // Try to parse error message from server
        let errorMessage = 'An error occurred';
        let errorData = null;
        try {
            const errorJson = await response.json();
            errorMessage = errorJson.message || response.statusText;
            errorData = errorJson;
        } catch (e) {
            errorMessage = response.statusText;
        }

        throw new ApiError(response.status, errorMessage, errorData);
    }

    // Ensure 204 No Content is handled
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const apiClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        fetchJson<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        fetchJson<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        fetchJson<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        fetchJson<T>(endpoint, { ...options, method: 'DELETE' }),

    // Helper for file uploads (FormData)
    upload: async <T>(endpoint: string, formData: FormData, options?: RequestOptions) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            method: 'POST',
            body: formData, // Content-Type header should be omitted for FormData to let browser set boundary
        });

        if (!response.ok) {
            let errorMessage = 'Upload failed';
            try {
                const errorJson = await response.json();
                errorMessage = errorJson.message || response.statusText;
            } catch (e) {
                errorMessage = response.statusText;
            }
            throw new ApiError(response.status, errorMessage);
        }
        return response.json() as Promise<T>;
    }
};
