export interface SpaceWeatherService {
  fetchCurrentData(): Promise<{
    solarFlux: number;
    kpIndex: number;
    apIndex: number;
    dstIndex?: number;
  }>;
}

export class NOAASpaceWeatherService implements SpaceWeatherService {
  private readonly baseUrl = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json';
  private readonly solarFluxUrl = 'https://services.swpc.noaa.gov/products/solar-wind/f107.json';

  async fetchCurrentData(): Promise<{
    solarFlux: number;
    kpIndex: number;
    apIndex: number;
    dstIndex?: number;
  }> {
    try {
      // Fetch Kp index data
      const kpResponse = await fetch(this.baseUrl);
      const kpData = await kpResponse.json();
      
      // Get the most recent Kp index
      const latestKp = kpData[kpData.length - 1];
      const kpIndex = parseFloat(latestKp[1]);
      
      // Convert Kp to Ap (approximate conversion)
      const apIndex = this.kpToAp(kpIndex);

      // Fetch solar flux data
      let solarFlux = 140; // Default fallback
      try {
        const fluxResponse = await fetch(this.solarFluxUrl);
        const fluxData = await fluxResponse.json();
        if (fluxData.length > 0) {
          solarFlux = parseFloat(fluxData[fluxData.length - 1][6]); // F10.7 solar flux
        }
      } catch (error) {
        console.warn('Failed to fetch solar flux data, using default:', error);
      }

      return {
        solarFlux,
        kpIndex,
        apIndex,
        dstIndex: -20 // Mock Dst index - would need separate API call
      };
    } catch (error) {
      console.error('Failed to fetch space weather data:', error);
      // Return default values if API fails
      return {
        solarFlux: 140,
        kpIndex: 3.0,
        apIndex: 15,
        dstIndex: -20
      };
    }
  }

  private kpToAp(kp: number): number {
    // Approximate conversion from Kp to Ap index
    const kpToApMap: { [key: string]: number } = {
      '0': 0, '0.33': 2, '0.67': 3, '1': 4, '1.33': 5, '1.67': 6, '2': 7,
      '2.33': 9, '2.67': 12, '3': 15, '3.33': 18, '3.67': 22, '4': 27,
      '4.33': 32, '4.67': 39, '5': 48, '5.33': 56, '5.67': 67, '6': 80,
      '6.33': 94, '6.67': 111, '7': 132, '7.33': 154, '7.67': 179, '8': 207,
      '8.33': 236, '8.67': 300, '9': 400
    };

    const kpStr = kp.toFixed(2);
    return kpToApMap[kpStr] || 27; // Default to moderate activity
  }

  getSpaceWeatherStatus(kpIndex: number): {
    status: string;
    level: 'quiet' | 'unsettled' | 'active' | 'minor' | 'moderate' | 'strong' | 'severe';
    color: string;
  } {
    if (kpIndex < 1) return { status: 'Quiet', level: 'quiet', color: 'green' };
    if (kpIndex < 2) return { status: 'Unsettled', level: 'unsettled', color: 'yellow' };
    if (kpIndex < 3) return { status: 'Active', level: 'active', color: 'yellow' };
    if (kpIndex < 4) return { status: 'Minor Storm', level: 'minor', color: 'orange' };
    if (kpIndex < 5) return { status: 'Moderate Storm', level: 'moderate', color: 'orange' };
    if (kpIndex < 6) return { status: 'Strong Storm', level: 'strong', color: 'red' };
    return { status: 'Severe Storm', level: 'severe', color: 'red' };
  }
}
