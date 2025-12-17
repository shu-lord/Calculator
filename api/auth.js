export default function handler(req, res) {
  const clientId = process.env.client_id;
  
  // Always use production domain for callback
  const redirectUri = 'https://www.airedcell.dev/api/callback';
  
  // Debug: Log if client_id is missing
  if (!clientId) {
    return res.status(500).json({ 
      error: 'OAuth not configured. Missing client_id environment variable.',
      hint: 'Add client_id to Vercel Environment Variables'
    });
  }
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
  
  res.redirect(authUrl);
}
