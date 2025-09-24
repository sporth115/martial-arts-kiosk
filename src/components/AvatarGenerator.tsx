import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface AvatarGeneratorProps {
  onAvatarGenerated: (avatarUrl: string) => void;
  onClose: () => void;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ onAvatarGenerated, onClose }) => {
  const [prompt, setPrompt] = useState('martial arts student, friendly face, dojo uniform, digital art style');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateAvatar = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for the avatar');
      return;
    }

    setIsGenerating(true);
    try {
      // Add variation to the prompt to ensure fresh results
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 1000000);
      const randomVariations = [
        'unique style', 'different angle', 'fresh perspective', 'new variation', 
        'creative interpretation', 'artistic rendering', 'distinctive look'
      ];
      const randomVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)];
      const variedPrompt = `${prompt.trim()}, ${randomVariation}`;
      
      // Encode the varied prompt for URL
      const encodedPrompt = encodeURIComponent(variedPrompt);
      
      // Build the API URL with cache-busting parameters
      const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&model=flux&noLogo=true&private=true&seed=${randomSeed}&t=${timestamp}&nocache=${timestamp}`;
      
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
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      
      toast.success('Avatar generated successfully!');
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
    'martial arts student, friendly face, dojo uniform, digital art style',
    'karate student, confident expression, white belt, anime style',
    'taekwondo practitioner, smiling face, colorful uniform, cartoon style',
    'kung fu student, peaceful expression, traditional outfit, watercolor style',
    'judo athlete, determined look, white gi, realistic style',
    'mixed martial arts student, energetic pose, modern gear, digital painting',
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
            placeholder="Describe the avatar (e.g., martial arts student, friendly face, dojo uniform, digital art style)"
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
            disabled={isGenerating}
            style={{
              background: isGenerating ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
              padding: '12px 24px',
              color: 'white',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
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
              <img
                src={generatedImage}
                alt="Generated avatar"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
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
                disabled={isGenerating}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
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
