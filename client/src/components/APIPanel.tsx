import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function APIPanel() {
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

  const generateApiKey = () => {
    const newKey = `stpro_${Math.random().toString(36).substr(2, 24)}`;
    setApiKey(newKey);
    toast({
      title: "API Key Generated",
      description: "Your new API key has been generated successfully.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/satellite/{id}/position",
      description: "Get enhanced satellite position",
      color: "green"
    },
    {
      method: "GET",
      path: "/api/v1/satellites/enhanced",
      description: "List all enhanced satellites",
      color: "blue"
    },
    {
      method: "GET",
      path: "/api/v1/accuracy/validation",
      description: "Get accuracy validation results",
      color: "purple"
    },
    {
      method: "GET",
      path: "/api/v1/space-weather/current",
      description: "Current space weather data",
      color: "orange"
    }
  ];

  const sampleResponse = `{
  "satellite_id": "25544",
  "name": "ISS (ZARYA)",
  "position": {
    "latitude": 45.3621,
    "longitude": -122.7891,
    "altitude": 408.2
  },
  "velocity": {
    "x": 1234.56,
    "y": -5678.90,
    "z": 3456.78
  },
  "accuracy": {
    "estimated_error": "±187m",
    "confidence": 95.0,
    "method": "Enhanced+Kalman"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`;

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-space-900 mb-4">API Access</h2>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-space-700 mb-2">Available Endpoints:</h3>
          <div className="space-y-2 text-sm">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge 
                  variant="secondary"
                  className={`bg-${endpoint.color}-100 text-${endpoint.color}-800 font-mono text-xs`}
                >
                  {endpoint.method}
                </Badge>
                <code 
                  className="text-space-600 cursor-pointer hover:text-electric-600 transition-colors"
                  onClick={() => copyToClipboard(endpoint.path)}
                  title="Click to copy"
                >
                  {endpoint.path}
                </code>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-space-700 mb-2">Sample Response:</h3>
          <div className="bg-space-50 rounded-lg p-3 text-xs font-mono overflow-x-auto max-h-48">
            <pre className="text-space-600 whitespace-pre-wrap">{sampleResponse}</pre>
          </div>
        </div>

        {apiKey && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-space-700 mb-2">Your API Key:</h3>
            <div className="bg-space-50 rounded-lg p-3 flex items-center justify-between">
              <code className="text-sm font-mono text-space-700">{apiKey}</code>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => copyToClipboard(apiKey)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}

        <Button 
          onClick={generateApiKey}
          className="w-full bg-electric-600 hover:bg-electric-700"
        >
          <Key className="mr-2 h-4 w-4" />
          {apiKey ? "Regenerate API Key" : "Generate API Key"}
        </Button>
      </CardContent>
    </Card>
  );
}
