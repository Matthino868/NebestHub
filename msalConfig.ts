export const msalConfig = {
  auth: {
    clientId: "YOUR_APP_CLIENT_ID",   // Provided by your Azure AD
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage", // or localStorage
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // basic profile info
};