import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
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
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (path) {
    revalidatePath(path);
    return NextResponse.json({
      success: true,
      revalidated: path,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    status: 'Revalidation endpoint active',
    usage: 'GET or POST with ?path=/your/path',
  });
}
