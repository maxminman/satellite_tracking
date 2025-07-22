import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plug, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ConfigurationPanel() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isConnected, setIsConnected] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const testConnectionMutation = useMutation({
    mutationFn: async (creds: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/config/test-spacetrack", creds);
      return response.json();
    },
    onSuccess: (data) => {
      setIsConnected(data.success);
      toast({
        title: data.success ? "Connection Successful" : "Connection Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/satellites"] });
    },
    onError: (error) => {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleTestConnection = () => {
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    testConnectionMutation.mutate(credentials);
  };

  const dataSources = [
    {
      name: "NOAA SWPC",
      description: "Space weather data",
      status: "Active",
      color: "green"
    },
    {
      name: "NRLMSISE-00",
      description: "Atmospheric density model",
      status: "Running",
      color: "green"
    },
    {
      name: "EGM96 Gravity Model",
      description: "High-order Earth gravity",
      status: "Loaded",
      color: "green"
    }
  ];

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-space-900 mb-4">System Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-space-900 mb-4">Space-Track.org Integration</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-space-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your Space-Track username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-space-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your Space-Track password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-space-600">
                  {isConnected ? "Connected" : "Not Connected"}
                </span>
              </div>
              
              <Button 
                onClick={handleTestConnection}
                disabled={testConnectionMutation.isPending}
                className="bg-electric-600 hover:bg-electric-700"
              >
                <Plug className="mr-2 h-4 w-4" />
                {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-space-900 mb-4">Data Sources Configuration</h3>
            
            <div className="space-y-4">
              {dataSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-space-50 rounded-lg">
                  <div>
                    <div className="font-medium text-space-900">{source.name}</div>
                    <div className="text-sm text-space-600">{source.description}</div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`bg-${source.color}-100 text-${source.color}-800`}
                  >
                    {source.status}
                  </Badge>
                </div>
              ))}

              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
