export default async function handler(req, res) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  const clientId = process.env.client_id;
  const clientSecret = process.env.client_secret;

  if (!clientId || !clientSecret) {
    return res.status(500).send('OAuth credentials not configured');
  }

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
      return res.status(400).send(`GitHub OAuth error: ${tokenData.error_description}`);
    }

    const { access_token } = tokenData;

    // Return HTML that passes the token to Decap CMS
    // Using the exact format Decap CMS expects
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
</head>
<body>
  <p>Completing authorization...</p>
  <script>
    (function() {
      function receiveMessage(e) {
        console.log("receiveMessage %o", e);
        
        // Send the token to the opener (Decap CMS)
        window.opener.postMessage(
          'authorization:github:success:{"token":"${access_token}","provider":"github"}',
          e.origin
        );
      }
      
      window.addEventListener("message", receiveMessage, false);
      
      // Tell the opener we're ready
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Failed to complete authorization');
  }
}
