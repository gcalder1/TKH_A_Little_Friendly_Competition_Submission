// backendClient.js
//
// This module exports a helper for creating an authenticated Axios
// instance.  Each request sent through the returned client will
// automatically include the provided JWT in the Authorization header
// and target the configured API base URL.  Using a helper like this
// avoids duplicating configuration across pages and makes it easy to
// adjust the API host in a single location if it changes in the
// future.

import axios from 'axios';

/**
 * Create an Axios instance configured to talk to our Express API.
 *
 * @param {string} token - A JWT issued by Supabase Auth.  If
 * provided, it will be sent as a Bearer token on every request.
 * @returns {import('axios').AxiosInstance}
 */
export function createBackendClient(token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return axios.create({
    baseURL: 'http://localhost:8888/api',
    headers
  });
}