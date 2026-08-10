const MICROSOFT_CLIENT_ID =
  import.meta.env.VITE_MICROSOFT_CLIENT_ID ?? "26168397-d2a9-4ce5-9159-f6dd91f9fecb";
const MICROSOFT_TENANT_ID =
  import.meta.env.VITE_MICROSOFT_TENANT_ID ?? "7ba0a4ed-fe76-431c-ad81-0aa301c54b9d";
const MICROSOFT_SCOPE =
  import.meta.env.VITE_MICROSOFT_SCOPE ??
  "openid profile email api://26168397-d2a9-4ce5-9159-f6dd91f9fecb/UPMS.Login";
const MICROSOFT_REDIRECT_PATH = "/auth/microsoft/callback";

const STATE_KEY = "upms_microsoft_oauth_state";
const VERIFIER_KEY = "upms_microsoft_pkce_verifier";
const STARTED_AT_KEY = "upms_microsoft_oauth_started_at";
const OAUTH_SESSION_MAX_AGE_MS = 10 * 60 * 1000;

function getRedirectUri() {
  return import.meta.env.VITE_MICROSOFT_REDIRECT_URI ?? `${window.location.origin}${MICROSOFT_REDIRECT_PATH}`;
}

function getOAuthStorage() {
  return window.localStorage;
}

function assertRedirectUriMatchesCurrentOrigin() {
  const redirectUri = new URL(getRedirectUri(), window.location.origin);

  if (redirectUri.origin !== window.location.origin) {
    throw new Error(
      `Microsoft sign-in is configured for ${redirectUri.origin}, but this page is ${window.location.origin}. Open the app on ${redirectUri.origin} or update VITE_MICROSOFT_REDIRECT_URI.`
    );
  }
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array) {
  const byteArray = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  byteArray.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createRandomString(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function createCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

export async function startMicrosoftLogin() {
  assertRedirectUriMatchesCurrentOrigin();

  const state = createRandomString();
  const verifier = createRandomString(64);
  const challenge = await createCodeChallenge(verifier);

  const storage = getOAuthStorage();
  storage.setItem(STATE_KEY, state);
  storage.setItem(VERIFIER_KEY, verifier);
  storage.setItem(STARTED_AT_KEY, String(Date.now()));

  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    response_mode: "query",
    scope: MICROSOFT_SCOPE,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });

  window.location.assign(
    `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`
  );
}

export async function exchangeMicrosoftCode(code: string, state: string | null) {
  assertRedirectUriMatchesCurrentOrigin();

  const storage = getOAuthStorage();
  const expectedState = storage.getItem(STATE_KEY);
  const verifier = storage.getItem(VERIFIER_KEY);
  const startedAt = Number(storage.getItem(STARTED_AT_KEY) ?? "0");

  storage.removeItem(STATE_KEY);
  storage.removeItem(VERIFIER_KEY);
  storage.removeItem(STARTED_AT_KEY);

  if (!startedAt || Date.now() - startedAt > OAUTH_SESSION_MAX_AGE_MS) {
    throw new Error("Microsoft sign-in session expired. Please try again.");
  }

  if (!state || !expectedState || state !== expectedState) {
    throw new Error("Microsoft sign-in state could not be verified.");
  }

  if (!verifier) {
    throw new Error("Microsoft sign-in session expired. Please try again.");
  }

  const body = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
    code_verifier: verifier,
    scope: MICROSOFT_SCOPE,
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error_description ?? "Microsoft sign-in failed.");
  }

  if (!payload.access_token) {
    throw new Error("Microsoft did not return an access token.");
  }

  return payload.access_token as string;
}
