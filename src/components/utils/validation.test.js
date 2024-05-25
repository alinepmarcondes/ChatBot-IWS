const { validateInputs } = require('./validation.js');
const { validateInputsType } = require('./validation.js');

describe('validateInputs', () => {
  let setErrorMessage;

  beforeEach(() => {
    setErrorMessage = jest.fn();
  });

  test('should return false and set error message if login is empty', () => {
    expect(validateInputs('', 'password123', setErrorMessage)).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Please fill in all fields');
  });

  test('should return false and set error message if password is empty', () => {
    expect(validateInputs('user', '', setErrorMessage)).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Please fill in all fields');
  });

  test('should return true if both login and password are provided', () => {
    expect(validateInputs('user', 'password123', setErrorMessage)).toBe(true);
    expect(setErrorMessage).not.toHaveBeenCalled();
  });
});

describe('validateInputsType', () => {
  let setErrorMessage;

  beforeEach(() => {
    setErrorMessage = jest.fn();
  });

  test('should return false and set error message if password is less than 8 characters', () => {
    expect(validateInputsType('pass1!', setErrorMessage)).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Password must be at least 8 characters long');
  });

  test('should return false and set error message if password is not complex enough', () => {
    expect(validateInputsType('password1', setErrorMessage)).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Password must be stronger');
  });

  test('should return true if password is strong enough', () => {
    expect(validateInputsType('Password1!', setErrorMessage)).toBe(true);
    expect(setErrorMessage).not.toHaveBeenCalled();
  });
});
