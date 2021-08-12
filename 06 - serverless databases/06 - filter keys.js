/*

	Call the API from a browser using the fetch() method.
	Change the endpoint to point to your serverless function.

	fetch('https://guide-keys-list.gomakethings.workers.dev', {
		method: 'DELETE',
		body: JSON.stringify({
			wizard: 'Gandalf'
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		throw response.status;
	}).then(function (data) {
		console.log(data);
	}).catch(function (error) {
		console.warn(error);
	});

*/

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {

	// Define response headers
	let headers = new Headers({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
		'Access-Control-Allow-Headers': '*'
	});

	// Handle the OPTIONS method
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 200,
			headers: headers
		});
	}

	// Get the first 30 wizard keys
	/*

		{
			"keys": [
				{
					"name": "Merlin",
					"expiration": 1234,
				}
			],
			"list_complete": false,
			"cursor": "6Ck1la0VxJ0djhidm1MdX2FyD"
		}

	 */
	let wizards = WIZARDS.list({limit: 30});

	// Get the next set of keys
	let wizardsNext = WIZARDS.list({cursor: '6Ck1la0VxJ0djhidm1MdX2FyD'});

	// Return the wizard keys
	return new Response(JSON.stringify(wizards), {
		status: 200,
		headers: headers
	});

}

// Listen for API calls
addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request));
});