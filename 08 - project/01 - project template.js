// Define response headers
let headers = new Headers({
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
	'Access-Control-Allow-Headers': '*'
});

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {

	// Catchall response
	return new Response(JSON.stringify(['Hello, world!']), {
		status: 200,
		headers: headers
	});

}

// Listen for API calls
addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request));
});