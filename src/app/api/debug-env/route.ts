import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
    nodeEnv: process.env.NODE_ENV,
    envFiles: {
      hasEnvLocal: !!process.env.DATABASE_URL,
      envLength: process.env.DATABASE_URL?.length || 0
    }
  });
}
