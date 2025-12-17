export default function handler(req, res) {
  const clientId = process.env.client_id;
  const redirectUri = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.airedcell.dev'}/api/callback`;
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
  
  res.redirect(authUrl);
}
