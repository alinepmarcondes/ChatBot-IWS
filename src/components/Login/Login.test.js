jest.mock('./Login.css', () => ({})); // Mocking the CSS file import

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';

test('All the fields should be filled', () => {
  const { getByText, getByPlaceholderText } = render(<Login />);
  const loginInput = getByPlaceholderText('Login');
  const passwordInput = getByPlaceholderText('Password');
  const loginButton = getByText('Next');

  // Simulate submission without filling in the fields
  fireEvent.click(loginButton);

  // Check if the error message is displayed
  expect(getByText('Please fill in all fields')).toBeInTheDocument();
});
