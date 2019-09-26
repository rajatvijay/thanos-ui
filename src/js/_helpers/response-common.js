export function handleResponse(response, from) {
  if (!response.ok) {
    return Promise.reject(response.status);
  }
  return response.json();
}
