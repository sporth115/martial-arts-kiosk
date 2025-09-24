import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dojo check-in title', () => {
  render(<App />);
  const titleElement = screen.getByText(/dojo check-in/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders search functionality', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/search students by name/i);
  expect(searchInput).toBeInTheDocument();
});

test('renders top students section', () => {
  render(<App />);
  const topStudentsElement = screen.getByText(/top students/i);
  expect(topStudentsElement).toBeInTheDocument();
});
