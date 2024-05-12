import React from 'react';
import { render, fireEvent, getByText, getByPlaceholderText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Edit from './Edit';
import { validateInputs } from '../utils/validation';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('validateInputs', () => {
    it('Updating an user without filling the fields', () => {
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

    it('Updating an user without filling the login field', () => {
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
    
      it('Update an user without filling the password field', () => {
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
    
      it('Successfully update an user', () => {
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