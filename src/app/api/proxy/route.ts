import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, data } = body;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    // const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = res.headers.get("content-disposition");

    // Case 1: Response is Excel file
    if (contentType && contentDisposition) {
      // return new Response(res.body, {
      //   headers: {
      //     "Content-Type": contentType,
      //     "Content-Disposition": contentDisposition,
      //   },
      // });
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
        },
      });
      // const blob = await res.blob();
      // return new NextResponse(blob, {
      //   status: 200,
      //   headers: {
      //     'Content-Type':
      //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      //     'Content-Disposition': 'attachment; filename="Types.xlsx"',
      //   },
      // });
    }

    // Case 2: Response is JSON
    const apiData = await res.json();
    if (!res.ok) {
      return NextResponse.json(apiData, { status: apiData.statusCode });
    }

    return NextResponse.json({ success: true, data: apiData });
  } catch (error) {
    console.error("API call failed:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
