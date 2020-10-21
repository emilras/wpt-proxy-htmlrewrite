


const rewriter = new HTMLRewriter()
  .on("head", {
  element: el => {
    el.prepend('<link rel="preload" as="image" href="/hero.jpg">',{ html: true });
  }
  });

  /**
 * Handle all requests. Proxy requests with an x-host header and return 403
 * for everything else
 */
async function handleRequest(event)
{
  const host = event.request.headers.get("x-host");
  console.log(host);
  if (host) {
    const url = new URL(event.request.url);
    const originUrl = url.protocol + "//" + host + url.pathname + url.search;

    let init = {
      method: event.request.method,

      redirect: "manual",

      headers: [...event.request.headers]
    };


    const res = await fetch(originUrl, init);
    
    return rewriter.transform(res);

  } else {
    const response = new Response("x-Host headers missing", { status: 403 });
    event.respondWith(response);
  }
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event));
})