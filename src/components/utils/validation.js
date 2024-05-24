export const validateInputs = (login, password, setErrorMessage) => {
    if (!login.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields');
      return false;
    }
    return true;
  };

export function validateInputsType( password, setErrorMessage) {
  if (password.length < 8) {
    setErrorMessage('Password must be at least 8 characters long');
    return false;
  }
  const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordComplexityRegex.test(password)) {
    setErrorMessage('Password must be stronger');
    return false;
  }
  return true;
}