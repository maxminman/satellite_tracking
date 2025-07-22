import { apiRequest } from "./queryClient";

export interface SatellitePosition {
  satellite_id: string;
  name: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  accuracy: {
    estimated_error: string;
    confidence: number;
    method: string;
  };
  timestamp: string;
}

export interface SpaceWeatherData {
  id: number;
  timestamp: string;
  solarFlux: number;
  kpIndex: number;
  apIndex: number;
  dstIndex?: number;
  source: string;
  status?: {
    status: string;
    level: string;
    color: string;
  };
}

export interface ValidationResult {
  noradId: string;
  timestamp: string;
  predictedLat: number;
  predictedLon: number;
  predictedAlt: number;
  actualLat: number;
  actualLon: number;
  actualAlt: number;
  errorDistance: number;
  method: string;
}

export interface SystemStats {
  totalSatellites: number;
  avgAccuracy: number;
  validatedSatellites: number;
  apiCallsToday: number;
}

export class SatelliteAPI {
  static async getSystemStats(): Promise<SystemStats> {
    const response = await apiRequest("GET", "/api/dashboard/stats");
    return response.json();
  }

  static async getSatellites(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/satellites");
    return response.json();
  }

  static async getSatellitePosition(noradId: string): Promise<SatellitePosition> {
    const response = await apiRequest("GET", `/api/satellites/${noradId}/position`);
    return response.json();
  }

  static async getSatelliteHistory(noradId: string, limit?: number): Promise<any[]> {
    const url = `/api/satellites/${noradId}/history${limit ? `?limit=${limit}` : ''}`;
    const response = await apiRequest("GET", url);
    return response.json();
  }

  static async getCurrentSpaceWeather(): Promise<SpaceWeatherData> {
    const response = await apiRequest("GET", "/api/space-weather/current");
    return response.json();
  }

  static async getSpaceWeatherHistory(limit?: number): Promise<SpaceWeatherData[]> {
    const url = `/api/space-weather/history${limit ? `?limit=${limit}` : ''}`;
    const response = await apiRequest("GET", url);
    return response.json();
  }

  static async getValidationResults(noradId?: string, limit?: number): Promise<{
    totalValidations: number;
    averageError: number;
    sub300mCount: number;
    sub300mPercentage: number;
    results: ValidationResult[];
  }> {
    let url = "/api/validation/results";
    const params = new URLSearchParams();
    if (noradId) params.append("noradId", noradId);
    if (limit) params.append("limit", limit.toString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiRequest("GET", url);
    return response.json();
  }

  static async getSystemPerformance(): Promise<any> {
    const response = await apiRequest("GET", "/api/system/performance");
    return response.json();
  }

  static async testSpaceTrackConnection(username: string, password: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiRequest("POST", "/api/config/test-spacetrack", {
      username,
      password
    });
    return response.json();
  }
}
