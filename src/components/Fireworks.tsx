import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FireworksProps {
  show: boolean;
  onComplete: () => void;
}

const Fireworks: React.FC<FireworksProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    angle: number;
    velocity: number;
    life: number;
  }>>([]);

  useEffect(() => {
    if (show) {
      // Create multiple firework bursts
      const createFirework = (centerX: number, centerY: number, color: string) => {
        const newParticles = [];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
          const velocity = 2 + Math.random() * 4;
          
          newParticles.push({
            id: Math.random(),
            x: centerX,
            y: centerY,
            color,
            size: 3 + Math.random() * 4,
            angle,
            velocity,
            life: 1,
          });
        }
        
        return newParticles;
      };

      // Create multiple firework bursts at different positions
      const allParticles = [
        ...createFirework(50, 30, '#FFD700'), // Gold
        ...createFirework(70, 25, '#FF6B6B'), // Red
        ...createFirework(30, 35, '#4ECDC4'), // Teal
        ...createFirework(80, 40, '#45B7D1'), // Blue
        ...createFirework(20, 20, '#96CEB4'), // Green
        ...createFirework(60, 45, '#FFEAA7'), // Yellow
      ];

      setParticles(allParticles);

      // Animate particles
      const animate = () => {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + Math.cos(particle.angle) * particle.velocity,
            y: particle.y + Math.sin(particle.angle) * particle.velocity + 0.1, // Gravity
            velocity: particle.velocity * 0.98, // Friction
            life: particle.life - 0.02,
          })).filter(particle => particle.life > 0)
        );
      };

      const interval = setInterval(animate, 50);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {/* Firework particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                borderRadius: '50%',
                boxShadow: `
                  0 0 10px ${particle.color},
                  0 0 20px ${particle.color},
                  0 0 30px ${particle.color}
                `,
                opacity: particle.life,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Fireworks;
