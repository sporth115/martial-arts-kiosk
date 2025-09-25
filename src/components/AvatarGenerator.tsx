import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface AvatarGeneratorProps {
  onAvatarGenerated: (avatarUrl: string) => void;
  onClose: () => void;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ onAvatarGenerated, onClose }) => {
  const [prompt, setPrompt] = useState('martial arts student character, friendly face, dojo uniform, natural pose, complete character, digital art style');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Function to remove background from image using comprehensive pixel analysis
  const removeBackground = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        // Function to get pixel index
        const getPixelIndex = (x: number, y: number) => y * width + x;
        
        // Function to get pixel color
        const getPixelColor = (x: number, y: number) => {
          if (x < 0 || x >= width || y < 0 || y >= height) return null;
          const idx = getPixelIndex(x, y) * 4;
          return {
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            a: data[idx + 3]
          };
        };
        
        // Smart function to check if pixel is green background (protects character features)
        const isGreenBackground = (color: any, x: number, y: number) => {
          if (!color || color.a === 0) return true;
          
          // Only detect very specific green background colors
          const isBrightGreen = color.g > 180 && color.r < 120 && color.b < 120;
          const isGreen = color.g > 150 && color.r < 100 && color.b < 100;
          const isLightGreen = color.g > 200 && color.r < 150 && color.b < 150;
          
          // Check for corner and edge pixels (more likely to be background)
          const isCorner = (x < 15 || x > width - 15) && (y < 15 || y > height - 15);
          const isEdge = x < 10 || x > width - 10 || y < 10 || y > height - 10;
          
          // Only remove green background pixels, not white/light colors that could be clothing
          if (isEdge || isCorner) {
            // Only remove if it's clearly green background
            return isBrightGreen || isGreen || isLightGreen;
          }
          
          // Only remove very obvious green background pixels
          return isBrightGreen || isGreen || isLightGreen;
        };
        
        // First pass: Remove green background pixels
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const color = getPixelColor(x, y);
            if (isGreenBackground(color, x, y)) {
              const idx = getPixelIndex(x, y) * 4;
              data[idx + 3] = 0; // Make transparent
            }
          }
        }
        
        // Second pass: Remove isolated pixels and clean up artifacts (protect character features)
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = getPixelIndex(x, y) * 4;
            if (data[idx + 3] === 0) continue; // Skip already transparent pixels
            
            // Check surrounding pixels
            let transparentNeighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const neighborIdx = getPixelIndex(x + dx, y + dy) * 4;
                if (data[neighborIdx + 3] === 0) {
                  transparentNeighbors++;
                }
              }
            }
            
            // Only remove if it's clearly green background, not white/light clothing
            if (transparentNeighbors >= 6) {
              const color = getPixelColor(x, y);
              if (color && (color.g > 150 && color.r < 120 && color.b < 120)) {
                data[idx + 3] = 0;
              }
            }
          }
        }
        
        // Third pass: Remove only green background pixels in corners and edges (protect character features)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const isEdge = x < 20 || x > width - 20 || y < 20 || y > height - 20;
            if (isEdge) {
              const color = getPixelColor(x, y);
              // Only remove if it's clearly green background, not white/light clothing
              if (color && (color.g > 150 && color.r < 120 && color.b < 120)) {
                const idx = getPixelIndex(x, y) * 4;
                data[idx + 3] = 0;
              }
            }
          }
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const processedUrl = URL.createObjectURL(blob);
            resolve(processedUrl);
          } else {
            reject(new Error('Failed to process image'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  };

  const generateAvatar = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for the avatar');
      return;
    }

    setIsGenerating(true);
    try {
      // Add green background instructions and variation to the prompt
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 1000000);
      const randomVariations = [
        'unique style', 'different angle', 'fresh perspective', 'new variation', 
        'creative interpretation', 'artistic rendering', 'distinctive look'
      ];
      const randomVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)];
      
      // Automatically add green background instructions and natural character instructions
      const greenBackgroundInstructions = ', bright green background, avoid green colors in character clothing and features, no green in character design, natural character pose, complete character, no cropping, no cut-off appearance';
      
      // Add mandatory green background instruction
      const mandatoryInstruction = 'use green background image and do not use green color to generate the avatar. Please keep in mind it is a must.';
      
      const variedPrompt = `${prompt.trim()}${greenBackgroundInstructions}, ${mandatoryInstruction}, ${randomVariation}`;
      
      // Encode the varied prompt for URL
      const encodedPrompt = encodeURIComponent(variedPrompt);
      
      // Build the API URL with green background for better corner detection
      const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&model=flux&noLogo=true&private=true&seed=${randomSeed}&t=${timestamp}&nocache=${timestamp}&style=portrait&format=png&quality=high&background=green`;
      
      // Pollinations API doesn't support custom headers due to CORS restrictions
      // We'll make a simple GET request without any custom headers
      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }

      // Convert the response to a blob URL
      const blob = await response.blob();
      const originalImageUrl = URL.createObjectURL(blob);
      
      // Remove green background from the generated image
      setIsProcessing(true);
      try {
        const processedImageUrl = await removeBackground(originalImageUrl);
        setGeneratedImage(processedImageUrl);
        toast.success('Avatar generated and background removed successfully!');
      } catch (bgError) {
        console.warn('Background removal failed, using original image:', bgError);
        // If background removal fails, still try to process the image
        setGeneratedImage(originalImageUrl);
        toast.success('Avatar generated successfully!');
      } finally {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Avatar generation error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to generate avatar. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. The AI service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'Authentication error. Please check your API token configuration.';
        } else if (error.message.includes('Supabase not configured')) {
          errorMessage = 'Avatar service not configured. Please check your setup.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const useGeneratedAvatar = () => {
    if (generatedImage) {
      onAvatarGenerated(generatedImage);
      onClose();
    }
  };

  const presetPrompts = [
    'martial arts student character, friendly face, dojo uniform, natural pose, complete character, digital art style',
    'karate student character, confident expression, white belt, natural pose, complete character, anime style',
    'taekwondo practitioner character, smiling face, colorful uniform, natural pose, complete character, cartoon style',
    'kung fu student character, peaceful expression, traditional outfit, natural pose, complete character, watercolor style',
    'judo athlete character, determined look, white gi, natural pose, complete character, realistic style',
    'mixed martial arts student character, energetic pose, modern gear, natural pose, complete character, digital painting',
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '30px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            color: 'white',
            margin: 0,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Sparkles size={24} />
            AI Avatar Generator
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            display: 'block',
          }}>
            Describe the avatar you want:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the avatar (e.g., martial arts student character, friendly face, dojo uniform, natural pose, complete character, digital art style)"
            style={{
              width: '100%',
              height: '80px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            color: 'white',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Quick presets:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px',
          }}>
            {presetPrompts.map((preset, index) => (
              <button
                key={index}
                onClick={() => setPrompt(preset)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={generateAvatar}
            disabled={isGenerating || isProcessing}
            style={{
              background: (isGenerating || isProcessing) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
              padding: '12px 24px',
              color: 'white',
              cursor: (isGenerating || isProcessing) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              transition: 'all 0.3s ease',
            }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Generating...
              </>
            ) : isProcessing ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Removing Background...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Avatar
              </>
            )}
          </button>
        </div>

        {generatedImage && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '15px', textAlign: 'center' }}>
              Generated Avatar:
            </h3>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0)',
                backgroundSize: '20px 20px',
                padding: '10px',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}>
                <img
                  src={generatedImage}
                  alt="Generated avatar with transparent background"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                />
              </div>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '12px', 
                margin: '8px 0 0 0',
                fontStyle: 'italic'
              }}>
                Background removed - character only
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={useGeneratedAvatar}
                style={{
                  background: '#4CAF50',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={16} />
                Use This Avatar
              </button>
              <button
                onClick={generateAvatar}
                disabled={isGenerating || isProcessing}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: (isGenerating || isProcessing) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={16} />
                Generate Another
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AvatarGenerator;
