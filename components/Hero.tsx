'use client'
import React from 'react'
import { motion } from "framer-motion";
import ParticleBackground from './ParticleBackground';
import { Shield, Terminal, Zap } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const Hero = () => {
  return (
    <div 
        className="relative flex items-center min-h-[calc(100vh-64px)]" 
        id="hero-section"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        
        {/* Animated glow */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]" />
        
        {/* Using our new ParticleBackground component */}
        <ParticleBackground
          containerId="hero-section"
          particleCount={50}
          particleColor="rgba(255, 255, 255, 0.6)"
          speedFactor={0.2}
          particleSize={{ min: 1, max: 2.5 }}
        />
        
        <div className="container relative mx-auto px-4 py-12 md:py-16 lg:py-20 flex-1 flex items-center justify-center">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <Shield className="h-24 w-24 text-primary/30" />
                <Terminal className="h-12 w-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent pb-2 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              HexKit
            </motion.h1>

            <motion.p
              className="mt-6 text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Your all-in-one platform for Capture The Flag challenges featuring a comprehensive 
              suite of cryptography, encoding, and analysis tools to help you crack the code and capture the flag.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/tools">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Explore Tools
                </Button>
              </Link>

              <Link
                href="https://github.com/SrihasRC/HexKit"
                target="_blank"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/40 text-white hover:bg-primary/10 cursor-pointer"
                >
                  View on GitHub
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

  )
}

export default Hero
