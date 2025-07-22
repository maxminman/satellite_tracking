import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ZoomIn, ZoomOut, Home } from "lucide-react";
import EarthVisualization from "@/components/EarthVisualization";

interface SatelliteData {
  noradId: string;
  name: string;
  currentPosition?: {
    latitude: number;
    longitude: number;
    altitude: number;
    timestamp: string;
    accuracyEstimate?: number;
  };
}

export default function LiveTrackingPanel() {
  const [filter, setFilter] = useState("all");

  const { data: satellites, isLoading, refetch } = useQuery<SatelliteData[] | {satellites: SatelliteData[], message: string}>({
    queryKey: ["/api/satellites"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Handle new API response format that includes message for no data
  const satelliteArray = Array.isArray(satellites) ? satellites : satellites?.satellites || [];
  
  const filteredSatellites = satelliteArray.filter((sat: any) => {
    if (filter === "all") return true;
    const altitude = sat.currentPosition?.altitude || 0;
    switch (filter) {
      case "leo": return altitude < 2000;
      case "meo": return altitude >= 2000 && altitude < 35786;
      case "geo": return altitude >= 35786;
      default: return true;
    }
  }).slice(0, 10) || [];

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-space-900">Live Satellite Tracking</h2>
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-white border border-space-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Satellites</SelectItem>
                <SelectItem value="leo">LEO (&lt; 2000km)</SelectItem>
                <SelectItem value="meo">MEO (2000-35786km)</SelectItem>
                <SelectItem value="geo">GEO (35786km)</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => refetch()} 
              disabled={isLoading}
              className="bg-electric-600 hover:bg-electric-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* 3D Visualization Container */}
        <div className="relative bg-gradient-to-b from-space-900 to-space-800 rounded-lg h-96 overflow-hidden mb-6">
          <EarthVisualization satellites={filteredSatellites} />
          
          {/* Accuracy overlay */}
          <div className="absolute top-4 right-4 glass-effect rounded-lg p-3">
            <div className="text-sm text-space-600 mb-1">Current View Accuracy</div>
            <div className="text-lg font-bold text-green-400">&lt; 300m</div>
          </div>

          {/* Control overlay */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <Button size="sm" variant="secondary" className="glass-effect hover:bg-white/20">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="glass-effect hover:bg-white/20">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="glass-effect hover:bg-white/20">
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Satellite details table */}
        <div>
          <h3 className="text-lg font-semibold text-space-900 mb-4">Active Tracking</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-space-200">
                  <th className="text-left py-2 text-sm font-medium text-space-600">Satellite</th>
                  <th className="text-left py-2 text-sm font-medium text-space-600">Altitude</th>
                  <th className="text-left py-2 text-sm font-medium text-space-600">Accuracy</th>
                  <th className="text-left py-2 text-sm font-medium text-space-600">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-space-600">
                      Loading satellites...
                    </td>
                  </tr>
                ) : satelliteArray.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-space-600">
                      No authentic satellite data available - Space-Track API required
                    </td>
                  </tr>
                ) : (
                  filteredSatellites.map((satellite: any) => {
                    const position = satellite.currentPosition;
                    const accuracy = position?.accuracyEstimate || 1000;
                    const accuracyColor = accuracy < 300 ? 'green' : accuracy < 500 ? 'yellow' : 'red';
                    
                    return (
                      <tr key={satellite.noradId} className="border-b border-space-100 hover:bg-space-50/50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-electric-400 rounded-full"></div>
                            <span className="font-medium text-space-900">{satellite.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-space-600">
                          {position ? `${position.altitude.toFixed(1)} km` : 'N/A'}
                        </td>
                        <td className="py-3">
                          <span className={`bg-${accuracyColor}-100 text-${accuracyColor}-800 px-2 py-1 rounded text-xs font-medium`}>
                            ±{Math.round(accuracy)}m
                          </span>
                        </td>
                        <td className="py-3 text-space-600">
                          {position ? new Date(position.timestamp).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
