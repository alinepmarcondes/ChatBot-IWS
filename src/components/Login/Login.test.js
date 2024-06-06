import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login';
import { validateInputs } from '../utils/validation';
import { useNavigate } from 'react-router-dom';

// Mock para o hook useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock para a função validateInputs
jest.mock('../utils/validation', () => ({
  validateInputs: jest.fn(),
}));

describe('Testing Error Responses - Login Component Integration Tests', () => {
  it('shows error message when login field is empty', async () => {
    const setErrorMessageMock = jest.fn();
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      setErrorMessageMock();
      return false;
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(<Login />);

    await act(async () => {
      fireEvent.change(getByPlaceholderText('Login'), { target: { value: '' } });
      fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
      fireEvent.click(getByText('Next'));
    });

    expect(setErrorMessageMock).toHaveBeenCalled();
    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });

  it('shows error message when password field is empty', async () => {
    const setErrorMessageMock = jest.fn();
    validateInputs.mockImplementation((login, password, setErrorMessage) => {
      setErrorMessage('Please fill in all fields');
      setErrorMessageMock();
      return false;
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(<Login />);

    await act(async () => {
      fireEvent.change(getByPlaceholderText('Login'), { target: { value: 'username' } });
      fireEvent.change(getByPlaceholderText('Password'), { target: { value: '' } });
      fireEvent.click(getByText('Next'));
    });

    expect(setErrorMessageMock).toHaveBeenCalled();
    expect(getByTestId('error-message')).toHaveTextContent('Please fill in all fields');
  });
});

describe('Testing Successful Workflow - Login Component Integration Tests', () => {
  it('navigates to /chat when fields are correctly filled', async () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);

    // Simular que a validação de entrada retorna true
    validateInputs.mockImplementation((login, password, setErrorMessage) => true);

    // Simular uma resposta bem-sucedida do servidor
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ user: { _id: '12345' } }), // Ajuste para retornar um ID de usuário
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const { getByText, getByPlaceholderText } = render(<Login />);

    // Simular a interação do usuário preenchendo os campos e clicando no botão
    await act(async () => {
      fireEvent.change(getByPlaceholderText('Login'), { target: { value: 'username' } });
      fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
      fireEvent.click(getByText('Next'));
    });

    // Verificar se a função navigate foi chamada com '/chat'
    expect(navigateMock).toHaveBeenCalledWith('/chat');
  });
});
