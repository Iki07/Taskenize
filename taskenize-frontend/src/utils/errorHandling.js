export function useErrorHandling() {
  function getErrorMessage (error) {
    if (error.response && error.response.data && error.response.data.msg) {
      return error.response.data.msg;
    }
    return "There has been an error. Please try again.";
  };

  return { getErrorMessage };
}
