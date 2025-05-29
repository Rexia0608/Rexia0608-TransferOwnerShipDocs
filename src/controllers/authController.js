import { oauth2Client, SCOPES } from '../config/googleAuth.js';

export const getAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(url);
};

export const oauthCallback = async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Store tokens in session
    req.session.tokens = tokens;
    req.session.loggedIn = true;
    
    res.redirect('/transfer/files');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.redirect('/?error=auth_failed');
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};