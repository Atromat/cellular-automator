import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import App from '../src/App';

describe('App component', () => {
  it('renders Cellular Automator (home page), Sign In and Register navbar links', () => {
    render(<App />);

    expect(screen.getByText('Cellular Automator')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});