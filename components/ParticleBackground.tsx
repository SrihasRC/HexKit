"use client";

import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  containerId: string;
  particleCount?: number;
  particleColor?: string;
  speedFactor?: number;
  particleSize?: {
    min: number;
    max: number;
  };
}

const ParticleBackground = ({
  containerId,
  particleCount = 40,
  particleColor = "rgba(255, 255, 255, 0.7)", // White particles by default
  speedFactor = 0.3,
  particleSize = { min: 1, max: 2 },
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.warn(`Container with ID "${containerId}" not found for particle animation`);
      return;
    }
    
    // Set canvas dimensions and styles
    const setCanvasDimensions = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    setCanvasDimensions();
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // Ensure it doesn't block interactions
    canvas.style.zIndex = '1';
    canvas.id = 'particle-canvas';
    
    // Add canvas to the container
    container.appendChild(canvas);
    
    // Get canvas context for drawing
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Generate particles
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
      speedX: (Math.random() - 0.5) * speedFactor,
      speedY: (Math.random() - 0.5) * speedFactor,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    
    // Animation function with time-based animation
    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (!ctx) return;
      
      // Calculate delta time for smooth animation regardless of frame rate
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position with time-based movement
        particle.x += particle.speedX * (deltaTime / 16); // Normalize to ~60fps
        particle.y += particle.speedY * (deltaTime / 16);
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Use the provided particle color
        const color = particleColor.startsWith('rgba') 
          ? particleColor 
          : `rgba(255, 255, 255, ${particle.opacity})`; // Default white with opacity
        
        ctx.fillStyle = color;
        ctx.fill();
      });
      
      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Handle resize
    const handleResize = () => {
      setCanvasDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerId, particleCount, particleColor, speedFactor, particleSize]);

  // This component doesn't render anything visible directly
  return null;
}

export default ParticleBackground;