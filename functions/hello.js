export async function onRequest(context) {
  console.log(`[LOGGING FROM /hello]: Request came from ${context.request}`);

  return new Response("Hello, world! Ya jerk!");
}