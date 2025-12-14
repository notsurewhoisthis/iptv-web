import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Validate authorization token
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const token = process.env.REVALIDATE_TOKEN;

  // If no token is configured, deny all requests (secure by default)
  if (!token) {
    console.warn('REVALIDATE_TOKEN not configured - all revalidation requests denied');
    return false;
  }

  return authHeader === `Bearer ${token}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return NextResponse.json({
      success: true,
      revalidated: path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // GET without auth just returns status (no revalidation)
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (path) {
    // Require auth for actual revalidation
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    revalidatePath(path);
    return NextResponse.json({
      success: true,
      revalidated: path,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    status: 'Revalidation endpoint active',
    usage: 'POST with ?path=/your/path and Authorization: Bearer <token>',
  });
}
