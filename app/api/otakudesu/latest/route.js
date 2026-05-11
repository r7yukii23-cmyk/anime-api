import { getAllAnime } from "@/lib/engine"

export async function GET() {
  try {
    const data = await getAllAnime(5) // batasi biar aman

    return Response.json({
      status: "success",
      statusCode: 200,
      statusmessage:"OK",
      creator: "YUE",
      message: "",
      count: data.length,
      data
    })
  } catch (err) {
    return Response.json({
      status: "error",
      statusCode: 500,
      creator: "YUE",
      message: err.message,
      data: []
    })
  }
}        completed: []
      }
    }, { status: 200 }) // biar gak 500 lagi
  }
}
