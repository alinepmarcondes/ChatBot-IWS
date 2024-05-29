import React from 'react';
import { act } from 'react'; // Correct import for act
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Edit from './Edit';
import { validateInputs, validateInputsType } from '../utils/validation';
import { useNavigate , useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn()
}));

jest.mock('../utils/validation', () => ({
  validateInputs: jest.fn(),
  validateInputsType: jest.fn(),
}));

describe('Testing Error Responses - Edit Component Integration Tests', () => {

  beforeAll(() => {
    useParams.mockReturnValue({ id: '123' });
  });

  it('shows error message when login field is empty', async () => {
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    
    await act(async () => {
      fireEvent.change(getByTestId('login-input'), { target: { value: '' } });
      fireEvent.change(getByTestId('password-input'), { target: { value: 'password' } });
      fireEvent.click(getByText('Update'));
    });

    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });

  it('shows error message when password field is empty', async () => {
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    
    await act(async () => {
      fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
      fireEvent.change(getByTestId('password-input'), { target: { value: '' } });
      fireEvent.click(getByText('Update'));
    });

    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });

  it('shows error message when password doesn\'t have at least 8 characters', async () => {
    validateInputs.mockImplementation(() => true); // Assuming login and other checks pass
    validateInputsType.mockImplementation((password, setErrorMessage) => {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    
    await act(async () => {
      fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
      fireEvent.change(getByTestId('password-input'), { target: { value: '123' } });
      fireEvent.click(getByText('Update'));
    });

    expect(getByTestId('error-message')).toHaveTextContent('Password must be at least 8 characters long');
  });

  it('shows error message when password must be stronger', async () => {
    validateInputs.mockImplementation(() => true); // Assuming login and other checks pass
    validateInputsType.mockImplementation((password, setErrorMessage) => {
      setErrorMessage('Password must be stronger');
      return false;
    });

    const { getByText, getByTestId } = render(<Edit />);
    
    await act(async () => {
      fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
      fireEvent.change(getByTestId('password-input'), { target: { value: '12345678' } });
      fireEvent.click(getByText('Update'));
    });

    expect(getByTestId('error-message')).toHaveTextContent('Password must be stronger');
  });
});

describe('Testing Successful Workflow - Edit Component Integration Tests', () => {
  beforeAll(() => {
    useParams.mockReturnValue({ id: '123' });
  });

  it('navigates to /newuser when fields are correctly filled and server responds with success', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    const mockResponse = { ok: true }; // Mock response to simulate success
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
      ok: mockResponse.ok,
    });

    validateInputs.mockImplementation(() => true);
    validateInputsType.mockImplementation(() => true);

    const { getByText, getByTestId } = render(<Edit />);

    await act(async () => {
      fireEvent.change(getByTestId('login-input'), { target: { value: 'username' } });
      fireEvent.change(getByTestId('password-input'), { target: { value: '12345678Abc!' } });
      fireEvent.click(getByText('Update'));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/users/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: 'username', password: '12345678Abc!' }),
      });

      expect(navigateMock).toHaveBeenCalledWith('/newuser');
    });
  });
});

