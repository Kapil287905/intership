// utils/csrf.js

export async function getCSRFToken() {
  const res = await fetch("http://127.0.0.1:8000/api/get-csrf-token/", {
    credentials: 'include'
  });
  const data = await res.json();
  return data.csrfToken;
}
