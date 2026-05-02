// app/api/signin/route.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !token.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  
  // console.log("reachAPI",`${process.env.NEXT_PUBLIC_API_BASEURL}${url}`)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}${url}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
  if (!res.ok) {
    return new Response("Failed to fetch file", { status: res.status });
  }

  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const contentDisposition = res.headers.get("content-disposition") || 'attachment; filename="download.xlsx"';

  return new Response(res.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}

