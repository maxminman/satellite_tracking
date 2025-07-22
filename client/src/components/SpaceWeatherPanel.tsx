import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

interface SpaceWeatherData {
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

interface SystemPerformance {
  uptime: string;
  responseTime: string;
  tleProcessing: string;
  kalmanFilter: string;
  atmosphericModel: string;
  totalSatellites: number;
  avgAccuracy: number;
  spaceWeatherStatus: string;
}

export default function SpaceWeatherPanel() {
  const { data: spaceWeather, isLoading } = useQuery<SpaceWeatherData>({
    queryKey: ["/api/space-weather/current"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: performance } = useQuery<SystemPerformance>({
    queryKey: ["/api/system/performance"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const solarFluxPercentage = spaceWeather ? Math.min((spaceWeather.solarFlux / 300) * 100, 100) : 0;
  const kpPercentage = spaceWeather ? (spaceWeather.kpIndex / 9) * 100 : 0;
  const dstPercentage = spaceWeather?.dstIndex ? Math.min(Math.abs(spaceWeather.dstIndex) / 100 * 100, 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'quiet': return 'green';
      case 'unsettled':
      case 'active': return 'yellow';
      case 'minor storm':
      case 'moderate storm': return 'orange';
      default: return 'red';
    }
  };

  const statusColor = getStatusColor(spaceWeather?.status?.status || '');

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-space-900 mb-4">Space Weather Status</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-space-600">Solar Flux (F10.7)</span>
              <span className="font-semibold text-space-900">
                {spaceWeather?.solarFlux?.toFixed(1) || 'Loading...'}
              </span>
            </div>
            <Progress value={solarFluxPercentage} className="w-full" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-space-600">Geomagnetic (Kp)</span>
              <span className="font-semibold text-space-900">
                {spaceWeather?.kpIndex?.toFixed(1) || 'Loading...'}
              </span>
            </div>
            <Progress value={kpPercentage} className="w-full" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-space-600">Dst Index</span>
              <span className="font-semibold text-space-900">
                {spaceWeather?.dstIndex ? `${spaceWeather.dstIndex} nT` : 'Loading...'}
              </span>
            </div>
            <Progress value={dstPercentage} className="w-full" />
          </div>

          {spaceWeather?.status && (
            <div className={`mt-4 p-3 bg-${statusColor}-50 rounded-lg border border-${statusColor}-200`}>
              <div className="flex items-center">
                <AlertTriangle className={`text-${statusColor}-600 mr-2 h-4 w-4`} />
                <span className={`text-sm text-${statusColor}-800`}>
                  {spaceWeather.status.status} geomagnetic activity
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-space-900 mb-4">System Performance</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-space-600">TLE Processing</span>
                <span className="text-sm font-medium text-green-600">
                  {performance?.tleProcessing || 'Loading...'}
                </span>
              </div>
              <Progress value={97} className="w-full" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-space-600">Kalman Filter</span>
                <span className="text-sm font-medium text-green-600">
                  {performance?.kalmanFilter || 'Loading...'}
                </span>
              </div>
              <Progress value={94} className="w-full" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-space-600">NRLMSISE-00 Model</span>
                <span className="text-sm font-medium text-green-600">
                  {performance?.atmosphericModel || 'Loading...'}
                </span>
              </div>
              <Progress value={89} className="w-full" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-space-900">
                {performance?.uptime || 'Loading...'}
              </div>
              <div className="text-xs text-space-600">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-space-900">
                {performance?.responseTime || 'Loading...'}
              </div>
              <div className="text-xs text-space-600">Avg Response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
