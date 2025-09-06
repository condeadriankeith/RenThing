import { NextResponse } from 'next/server';
import { checkServerRestart } from '@/lib/server-utils';

export async function GET() {
  try {
    const status = checkServerRestart();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking server status:', error);
    return NextResponse.json({ error: 'Failed to check server status' }, { status: 500 });
  }
}
