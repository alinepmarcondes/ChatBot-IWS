import React from 'react';
import { render, fireEvent, getByText, getByPlaceholderText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Login from './Login';
import { validateInputs } from '../utils/validation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('validateInputs', () => {
  it('Loging in without filling the fields', () => {
    // Arrange
    const login = '';
    const password = '';
    const setErrorMessage = jest.fn(); // Mock setErrorMessage function

    // Act
    const isValid = validateInputs(login, password, setErrorMessage);

    // Assert
    expect(isValid).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('loging in without filling the login field', () => {
    // Arrange
    const login = '';
    const password = 'password';
    const setErrorMessage = jest.fn(); // Mock setErrorMessage function

    // Act
    const isValid = validateInputs(login, password, setErrorMessage);

    // Assert
    expect(isValid).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('loging in without filling the password field', () => {
    // Arrange
    const login = 'username';
    const password = '';
    const setErrorMessage = jest.fn(); // Mock setErrorMessage function

    // Act
    const isValid = validateInputs(login, password, setErrorMessage);

    // Assert
    expect(isValid).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('Successfully loging in', () => {
    // Arrange
    const login = 'username';
    const password = 'password';
    const setErrorMessage = jest.fn(); // Mock setErrorMessage function

    // Act
    const isValid = validateInputs(login, password, setErrorMessage);

    // Assert
    expect(isValid).toBe(true);
    expect(setErrorMessage).not.toHaveBeenCalled(); // Error message should not be set
  });
});

describe('Login Component', () => {
  it('navigates to /chat when fields are filled', () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);

    const { getByText, getByPlaceholderText } = render(<Login />);
    fireEvent.change(getByPlaceholderText('Login'), { target: { value: 'username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(getByText('Next'));

    expect(navigateMock).toHaveBeenCalledWith('/chat');
  });
});