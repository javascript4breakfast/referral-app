// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Only run on protected paths once you add auth
export const config = { matcher: ['/dashboard/:path*'] };