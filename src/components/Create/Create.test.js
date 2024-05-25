import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import Create from './Create';
import { validateInputs, validateInputsType } from '../utils/validation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../utils/validation', () => ({
  validateInputs: jest.fn(),
  validateInputsType: jest.fn(),
}));

describe('Create Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mocking fetch globally
  });

  afterEach(() => {
    global.fetch.mockClear(); // Clear mock after each test
  });

  it('successfully creates a user', async () => {
    validateInputs.mockImplementation(() => true);
    validateInputsType.mockImplementation(() => true);

    // Mocking fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { getByText, getByPlaceholderText } = render(<Create />);
    fireEvent.change(getByPlaceholderText('Login'), { target: { value: 'username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'Password1!' } });
    fireEvent.click(getByText('Create User')); // Simulate button click

    // Wait for async operation to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: 'username', password: 'Password1!', type: 'user' }),
    });
  });

  it('navigates to /newuser when the Back button is clicked', () => {
    const navigateMock = jest.fn(); // Mocking navigate function
    useNavigate.mockReturnValue(navigateMock); // Setting up the mock for useNavigate

    const { getByText } = render(<Create />);
    fireEvent.click(getByText('Back'));
    expect(navigateMock).toHaveBeenCalledWith('/newuser');
  });
});
