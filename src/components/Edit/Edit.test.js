import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Edit from './Edit';
import { validateInputs, validateInputsType } from '../utils/validation';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../utils/validation', () => ({
  validateInputs: jest.fn(),
  validateInputsType: jest.fn(),
}));

describe('Edit Component Integration Tests', () => {
  it('shows error message when login field is empty', () => {
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    fireEvent.change(getByTestId('login-input'), { target: { value: '' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: 'password' } });
    fireEvent.click(getByText('Update'));

    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });

  it('shows error message when password field is empty', () => {
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: '' } });
    fireEvent.click(getByText('Update'));

    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });

  it('shows error message when password doesn\'t have at least 8 characters', () => {
    validateInputs.mockImplementation(() => true); // Assuming login and other checks pass
    validateInputsType.mockImplementation((password, setErrorMessage) => {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(getByText('Update'));

    expect(getByTestId('error-message')).toHaveTextContent('Password must be at least 8 characters long');
  });

  it('shows error message when password must be stronger', () => {
    validateInputs.mockImplementation(() => true); // Assuming login and other checks pass
    validateInputsType.mockImplementation((password, setErrorMessage) => {
      setErrorMessage('Password must be stronger');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: '12345678' } });
    fireEvent.click(getByText('Update'));

    expect(getByTestId('error-message')).toHaveTextContent('Password must be stronger');
  });

  it('navigates to /newuser when fields are correctly filled', () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(() => navigateMock);
    
    validateInputs.mockImplementation(() => true);
    validateInputsType.mockImplementation(() => true);

    const { getByText, getByTestId } = render(<Edit />);
    fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: '12345678Abc!' } });
    fireEvent.click(getByText('Update'));

    expect(navigateMock).toHaveBeenCalledWith('/newuser');
  });
});
