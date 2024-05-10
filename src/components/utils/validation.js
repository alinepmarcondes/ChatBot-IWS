export const validateInputs = (login, password, setErrorMessage) => {
    if (!login.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields');
      return false;
    }
    return true;
  };
  