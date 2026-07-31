import html from './index.html';

// Static files in ./public are served by Cloudflare's asset handler BEFORE this
// worker runs — that covers /story, /privacy, /terms and everything under /brand/.
// This worker therefore owns exactly one route: the home page. Anything else that
// reaches here genuinely does not exist and must return 404.
//
// Before 31 Jul 2026 this returned the home page with HTTP 200 for every path, so a
// typo'd URL rendered as a soft 404 — invisible to monitoring and bad for SEO.

const HOME = new Set(['/', '/index.html']);

const notFound = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex" />
<title>Page not found — Space</title>
<link rel="icon" type="image/png" href="/space-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;800&display=swap" rel="stylesheet" />
<style>
  :root { --ink:#3D3633; --cream:#FDF8F0; --muted:#6B635A; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; background:var(--cream); color:var(--ink);
    font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:24px; }
  img { width:96px; height:auto; margin-bottom:20px; }
  h1 { font-size:1.5rem; font-weight:800; letter-spacing:-0.03em; margin:0 0 8px; }
  p { color:var(--muted); font-size:1rem; margin:0 0 28px; line-height:1.6; text-wrap:balance; }
  a { display:inline-block; background:var(--ink); color:var(--cream); text-decoration:none;
    font-weight:500; font-size:0.95rem; padding:12px 24px; border-radius:999px; }
</style>
</head>
<body>
  <img src="/brand/space-orb-mark.png" alt="" />
  <h1>This page isn't here.</h1>
  <p>It may have moved, or the link is off.</p>
  <a href="/">Back to Space</a>
</body>
</html>`;

export default {
  fetch(request) {
    const { pathname } = new URL(request.url);

    if (HOME.has(pathname)) {
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }

    return new Response(notFound, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });
  }
};
