import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sabra Music header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Sabra Music/i);
  expect(headerElement).toBeInTheDocument();
});
