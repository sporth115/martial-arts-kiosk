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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
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
        maxWidth: '600px',
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
              color: '#666',
              zIndex: 1,
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '16px 16px 16px 56px',
              fontSize: '18px',
              border: '2px solid #e1e5e9',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
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
                color: '#666',
                transition: 'all 0.2s ease',
              }}
              whileHover={{ 
                backgroundColor: '#f0f0f0',
                scale: 1.1 
              }}
            >
              <X size={20} />
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;
