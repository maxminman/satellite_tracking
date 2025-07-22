import { useEffect, useRef } from 'react';

interface Satellite {
  noradId: string;
  name: string;
  currentPosition?: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracyEstimate?: number;
  };
}

interface EarthVisualizationProps {
  satellites: Satellite[];
}

export default function EarthVisualization({ satellites }: EarthVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let rotation = 0;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const earthRadius = Math.min(centerX, centerY) * 0.3;

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw Earth
      const earthGradient = ctx.createRadialGradient(
        centerX - 20, centerY - 20, 0,
        centerX, centerY, earthRadius
      );
      earthGradient.addColorStop(0, '#4ade80');
      earthGradient.addColorStop(0.3, '#22c55e');
      earthGradient.addColorStop(0.7, '#3b82f6');
      earthGradient.addColorStop(1, '#1d4ed8');

      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fillStyle = earthGradient;
      ctx.fill();

      // Draw continental outlines (simplified)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.beginPath();
      ctx.ellipse(centerX - 10, centerY - 20, 15, 8, rotation, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(centerX + 15, centerY + 10, 12, 10, rotation, 0, Math.PI * 2);
      ctx.fill();

      // Draw satellite orbits and positions using real coordinates
      satellites.forEach((satellite, index) => {
        if (!satellite.currentPosition) return;

        // Convert geodetic coordinates to screen position
        const lat = satellite.currentPosition.latitude * Math.PI / 180;
        const lon = satellite.currentPosition.longitude * Math.PI / 180;
        const alt = satellite.currentPosition.altitude;
        
        // Rotate longitude based on time for Earth rotation effect
        const rotatedLon = lon + (rotation * Math.PI / 180 / 10);
        
        // Project 3D position to 2D screen (simplified orthographic projection)
        const screenX = centerX + Math.cos(lat) * Math.cos(rotatedLon) * (earthRadius + alt/50);
        const screenY = centerY + Math.sin(lat) * (earthRadius + alt/50);
        
        // Only draw if satellite is on visible hemisphere
        const isVisible = Math.cos(lat) * Math.sin(rotatedLon) >= 0;
        
        if (isVisible) {
          // Draw orbit path
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX, centerY, earthRadius + alt/50, 0, Math.PI * 2);
          ctx.stroke();

          // Draw satellite with accuracy-based color
          const accuracy = satellite.currentPosition.accuracyEstimate || 1000;
          const color = accuracy < 300 ? '#10b981' : accuracy < 500 ? '#f59e0b' : '#ef4444';
          
          const satelliteGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 4);
          satelliteGradient.addColorStop(0, color);
          satelliteGradient.addColorStop(1, color + '88');

          ctx.beginPath();
          ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
          ctx.fillStyle = satelliteGradient;
          ctx.fill();

          // Draw satellite label
          ctx.fillStyle = '#e5e7eb';
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            satellite.name.split(' ')[0], // Show first word of name
            screenX,
            screenY - 12
          );
          
          // Draw accuracy indicator
          ctx.fillStyle = color;
          ctx.font = '8px Inter, sans-serif';
          ctx.fillText(
            `±${Math.round(accuracy)}m`,
            screenX,
            screenY + 20
          );
        }
      });

      rotation += 0.5;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [satellites]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
      
      {/* Grid dots background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748B 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
}
