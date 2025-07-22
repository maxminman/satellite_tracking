import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Satellite, Target, Sun, Code } from "lucide-react";

interface SystemStats {
  totalSatellites: number;
  avgAccuracy: number;
  validatedSatellites: number;
  apiCallsToday: number;
}

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

export default function StatusOverview() {
  const { data: stats, isLoading } = useQuery<SystemStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: spaceWeather } = useQuery<SpaceWeatherData>({
    queryKey: ["/api/space-weather/current"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-effect">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-space-600 text-sm font-medium">Tracked Satellites</p>
                <p className="text-2xl font-bold text-space-900">
                  {stats?.totalSatellites?.toLocaleString() || "Loading..."}
                </p>
              </div>
              <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center">
                <Satellite className="text-electric-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">+142</span>
              <span className="text-space-500 text-sm ml-2">new today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-space-600 text-sm font-medium">Avg Accuracy</p>
                <p className="text-2xl font-bold text-space-900">
                  {stats?.avgAccuracy ? `${Math.round(stats.avgAccuracy)}m` : "Loading..."}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">↓ 76%</span>
              <span className="text-space-500 text-sm ml-2">vs TLE baseline</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-space-600 text-sm font-medium">Space Weather</p>
                <p className="text-2xl font-bold text-space-900">
                  {spaceWeather ? `Kp: ${spaceWeather.kpIndex?.toFixed(1)}` : "Loading..."}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Sun className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-600 text-sm font-medium">
                {spaceWeather?.status?.status || "Loading..."}
              </span>
              <span className="text-space-500 text-sm ml-2">
                {spaceWeather ? `F10.7: ${spaceWeather.solarFlux?.toFixed(1)}` : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-space-600 text-sm font-medium">API Calls Today</p>
                <p className="text-2xl font-bold text-space-900">
                  {stats?.apiCallsToday?.toLocaleString() || "Loading..."}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">99.7%</span>
              <span className="text-space-500 text-sm ml-2">uptime</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
