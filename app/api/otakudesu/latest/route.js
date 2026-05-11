import { getAllAnime } from "@/lib/engine"

export async function GET() {
  try {
    const data = await getAllAnime(1)

    return Response.json(
      {
        status: "success",
        statusCode: 200,
        creator: "YUE",
        message: "OK",
        count: data.length,
        data
      },
      { status: 200 }
    )
  } catch (err) {
    return Response.json(
      {
        status: "error",
        statusCode: 500,
        creator: "YUE",
        message: err.message,
        data: []
      },
      { status: 500 }
    )
  }
}
