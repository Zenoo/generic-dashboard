import {NextRequest, NextResponse} from 'next/server';

export function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  // This cron job will run every week, on Monday at 00:00
  // Do whatever you need to do here
  console.log('Cron job ran!');

  return NextResponse.json({ok: true});
}
