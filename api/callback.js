export default async function handler(req, res) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  const clientId = process.env.client_id;
  const clientSecret = process.env.client_secret;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const { access_token, token_type } = tokenData;

    // Return HTML that passes the token to the CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Complete</title>
</head>
<body>
  <script>
    (function() {
      const token = "${access_token}";
      const provider = "github";
      
      // Send message to parent window (Decap CMS)
      if (window.opener) {
        window.opener.postMessage(
          'authorization:' + provider + ':success:' + JSON.stringify({ token, provider }),
          '*'
        );
        window.close();
      } else {
        // Fallback - redirect to admin with token
        document.body.innerHTML = '<p>Authorization successful! Redirecting...</p>';
        setTimeout(function() {
          window.location.href = '/admin/';
        }, 1000);
      }
    })();
  </script>
  <noscript>
    <p>Authorization successful! Please close this window and return to the CMS.</p>
  </noscript>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Failed to complete authorization' });
  }
}
