// Define response headers
let headers = new Headers({
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': '*'
});

/**
 * Handle GET requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handleGET (request) {

	// Get the request body
	let params = new URL(request.url).searchParams;
	let key = params.get('key');

	// Get the comment data
	let comments = await COMMENTS.get(key);

	// If there's no comment data, create an array
	if (comments === null) {
		comments = '[]';
	}

	// return the comment data
	return new Response(comments, {
		status: 200,
		headers: headers
	});

}

/**
 * Handle POST requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handlePOST (request) {

	// Get the request body
	let body = await request.json();

	// Get the comment data
	let comments = await COMMENTS.get(body.key, {type: 'json'});

	// If there's no comment data, create an array
	if (comments === null) {
		comments = [];
	}

	// Add the comment data
	let comment = {
		name: body.name,
		url: body.url,
		comment: body.comment
	};
	comments.push(comment);

	// Save the comments back to the database
	let updated = await COMMENTS.put(body.key, JSON.stringify(comments));

	// If there's an error
	if (updated === null) {
		return new Response('Unable to save comment', {
			status: 404,
			headers: headers
		});
	}

	// Otherwise, return the comment data
	return new Response(JSON.stringify(comment), {
		status: 200,
		headers: headers
	});

}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {

	// Handle the OPTIONS method
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 200,
			headers: headers
		});
	}

	// Handle the GET method
	if (request.method === 'GET') {
		return await handleGET(request);
	}

	// Handle the POST method
	if (request.method === 'POST') {
		return await handlePOST(request);
	}

}

// Listen for API calls
addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request));
});