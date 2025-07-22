import { Satellite } from "lucide-react";
import StatusOverview from "@/components/StatusOverview";
import LiveTrackingPanel from "@/components/LiveTrackingPanel";
import SpaceWeatherPanel from "@/components/SpaceWeatherPanel";
import ValidationPanel from "@/components/ValidationPanel";
import APIPanel from "@/components/APIPanel";
import ConfigurationPanel from "@/components/ConfigurationPanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-700 text-white">
      {/* Navigation Header */}
      <header className="glass-effect border-b border-space-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-electric-500 to-electric-700 rounded-lg flex items-center justify-center">
                  <Satellite className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-space-900">SatTrack Pro</h1>
                  <p className="text-sm text-space-600">Enhanced Satellite Tracking</p>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#dashboard" className="text-space-900 hover:text-electric-600 transition-colors font-medium">Dashboard</a>
              <a href="#tracking" className="text-space-600 hover:text-electric-600 transition-colors font-medium">Live Tracking</a>
              <a href="#validation" className="text-space-600 hover:text-electric-600 transition-colors font-medium">Validation</a>
              <a href="#api" className="text-space-600 hover:text-electric-600 transition-colors font-medium">API</a>
              <a href="#settings" className="text-space-600 hover:text-electric-600 transition-colors font-medium">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                <span className="text-sm text-space-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatusOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <LiveTrackingPanel />
          </div>
          <div>
            <SpaceWeatherPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ValidationPanel />
          <APIPanel />
        </div>

        <ConfigurationPanel />
      </main>
    </div>
  );
}
