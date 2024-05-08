import React from 'react';
import { render, fireEvent, getByText, getByPlaceholderText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this to extend jest expect functionalities
import Login from './Login';
import { validateInputs } from './utils/validation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('validateInputs', () => {
  it('returns false and sets error message if login and password are empty', () => {
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

  it('returns false and sets error message if login is empty', () => {
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

  it('returns false and sets error message if password is empty', () => {
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

  it('returns true if login and password are not empty', () => {
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