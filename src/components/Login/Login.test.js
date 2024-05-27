import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login';
import { validateInputs } from '../utils/validation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../utils/validation', () => ({
  validateInputs: jest.fn(),
}));

describe('Testing Error Responses - Login Component Integration Tests', () => {
  it('shows error message when login field is empty', () => {
    const setErrorMessageMock = jest.fn();
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      setErrorMessageMock();
      return false;
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(<Login />);
    fireEvent.change(getByPlaceholderText('Login'), { target: { value: '' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(getByText('Next'));

    expect(setErrorMessageMock).toHaveBeenCalled();
    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });

  it('shows error message when password field is empty', () => {
    const setErrorMessageMock = jest.fn();
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      setErrorMessageMock();
      return false;
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(<Login />);
    fireEvent.change(getByPlaceholderText('Login'), { target: { value: 'username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '' } });
    fireEvent.click(getByText('Next'));

    expect(setErrorMessageMock).toHaveBeenCalled();
    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });
});

describe('Testing Successful Workflow - Login Component Integration Tests', () => {
  it('navigates to /chat when fields are correctly filled', () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);
    
    validateInputs.mockImplementation((login, password, setErrorMessage) => true);

    const { getByText, getByPlaceholderText } = render(<Login />);
    fireEvent.change(getByPlaceholderText('Login'), { target: { value: 'username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(getByText('Next'));

    expect(navigateMock).toHaveBeenCalledWith('/chat');
  });
});
