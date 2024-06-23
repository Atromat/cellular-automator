import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import App from '../src/App';

describe('App', () => {
  it('renders App component when user not signed in', () => {
    render(<App />);

    expect(screen.getByText('Cellular Automator')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});