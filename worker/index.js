export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API routes — handled by the Worker
    if (url.pathname.startsWith('/api/')) {
      return new Response('Hello from API', { status: 200 });
    }

    // Everything else — served from ./dist (your Vite build)
    return env.ASSETS.fetch(request);
  }
};
