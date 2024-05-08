import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  /*
  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    expect(getByText(/Enter your/i)).toBeInTheDocument(); // Using a regular expression to match across multiple lines
    expect(getByPlaceholderText('Login')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
  });
  
  it('displays error message when fields are empty', () => {
    const { getByText } = render(<Login />);
    fireEvent.click(getByText('Next'));
    expect(getByText(/Please fill in all fields/i)).toBeInTheDocument(); // Using a regular expression to match across multiple lines
  });
  */
  
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
