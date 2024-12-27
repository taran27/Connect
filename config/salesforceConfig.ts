export const salesforceConfig = {
  grant_type: 'password',
  clientId:
    '3MVG9g9rbsTkKnAVIKtekNW5Sc8M2F_Rio7LnT8a262Wei9z31rYUb1Ybk8dSTftwpftQe1YlXG7Y5EKBxzMs',
  clientSecret:
    'C365E50582193B3D069E2CC28A10FB94A95DB71EAD7181517D45CA2585BAFCF2', // Optional if using PKCE
  redirectUrl: 'com.myapp://oauthredirect', // Ensure this matches your app's settings
  scopes: ['api', 'refresh_token', 'openid', 'profile'], // Add/remove scopes as needed
  serviceConfiguration: {
    authorizationEndpoint:
      'https://login.salesforce.com/services/oauth2/authorize', // Use "https://test.salesforce.com" for sandbox
    tokenEndpoint: 'https://login.salesforce.com/services/oauth2/token',
    revokeEndpoint: 'https://login.salesforce.com/services/oauth2/revoke',
  },
}
