import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignIn from '../src/Pages/SignIn';
import { API_URL } from '../src/api';

describe('SignIn component', () => {
  it('renders email, password input and sign in button', () => {
    render(<SignIn />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('SignIn component', () => {
  it('stores token in localstorage after text input and clicking sign in', async () => {
    const user = userEvent.setup();
    render(<SignIn apiURL={API_URL} setIsUserSignedIn={(param) => param} />);
    const emailInputElement = screen.getByPlaceholderText('Email');
    const passwordInputElement = screen.getByPlaceholderText('Password');
    const signInButton = screen.getByRole('button');
    await user.type(emailInputElement, 'user@test.test');
    await user.type(passwordInputElement, 'pass');
    await user.click(signInButton);

    expect("tokenString").toStrictEqual(localStorage.getItem('userToken'));
  });
});