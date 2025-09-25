import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Not in the top 5? Find my name..." 
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Live search on every keystroke
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is now optional since we have live search
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto 30px auto',
      }}
    >
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search 
            size={24} 
            style={{
              position: 'absolute',
              left: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
            }}
          />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '12px 12px 12px 52px',
              fontSize: '18px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              e.target.style.boxShadow = '0 8px 40px rgba(255, 255, 255, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          {query && (
            <motion.button
              type="button"
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s ease',
              }}
              whileHover={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                scale: 1.1 
              }}
            >
              <X size={20} />
            </motion.button>
          )}
        </div>
      </form>
      
      {/* CSS for placeholder color */}
      <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          input::-moz-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          input:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}
      </style>
    </motion.div>
  );
};

export default SearchBar;
