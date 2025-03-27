export async function POST(request) {
    return new Response(
      JSON.stringify({
        success: true,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
  
  