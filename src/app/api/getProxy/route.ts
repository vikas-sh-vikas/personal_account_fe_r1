// app/api/signin/route.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
const token = await getToken({ req: request });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // You now have access to the accessToken
  const accessToken = token.accessToken;

  try {
    // const body = await request.json();
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // optional
      },
      // body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('External API call failed');
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API call failed:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
