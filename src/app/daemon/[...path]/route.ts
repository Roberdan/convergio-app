/**
 * Server-side proxy to the Convergio daemon.
 *
 * Browser calls /daemon/api/health → this route forwards to daemon:8420/api/health.
 * Strips X-Forwarded-* headers that trigger daemon auth middleware.
 */

const DAEMON_URL = process.env.API_URL ?? 'http://localhost:8420';

async function handler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const daemonPath = `/${path.join('/')}`;
  const url = new URL(request.url);
  const qs = url.search;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  const authHeader = request.headers.get('authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  const res = await fetch(`${DAEMON_URL}${daemonPath}${qs}`, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;

export const dynamic = 'force-dynamic';
