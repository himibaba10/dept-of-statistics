/**
 * Fetch wrapper that automatically refreshes the access token on 401
 * and retries the original request once. If refresh also fails, clears
 * localStorage and dispatches a custom 'auth:logout' event so AuthProvider
 * can react and clear user state.
 */
export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken') ?? '';

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (res.status !== 401) return res;

  // Access token expired — try refresh
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    forceLogout();
    return res;
  }

  const refreshRes = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!refreshRes.ok) {
    forceLogout();
    return res; // return original 401 so callers can handle if needed
  }

  const { data } = await refreshRes.json();
  const newAccessToken: string = data.accessToken;
  localStorage.setItem('accessToken', newAccessToken);

  // Retry original request with new token
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${newAccessToken}`
    }
  });
}

function forceLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authUser');
  window.dispatchEvent(new Event('auth:logout'));
}
