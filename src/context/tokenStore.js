let memoryTokens = {
  access_token: null,
  refresh_token: null,
};

export function getTokens() {
  return memoryTokens;
}

export function setTokens(access, refresh) {
  memoryTokens.access_token = access;
  memoryTokens.refresh_token = refresh;
}

export function clearTokens() {
  memoryTokens.access_token = null;
  memoryTokens.refresh_token = null;
}