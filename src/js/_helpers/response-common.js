export function handleResponse(response, from) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}