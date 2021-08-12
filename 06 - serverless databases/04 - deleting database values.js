/*

	Call the API from a browser using the fetch() method.
	Change the endpoint to point to your serverless function.

	fetch('https://guide-db-more-methods.gomakethings.workers.dev', {
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

	// Handle the GET method
	if (request.method === 'GET') {

		// Get the request body
		let params = new URL(request.url).searchParams;
		let key = params.get('key');

		// Get the wizard data
		let wizard = await WIZARDS.get(key, {type: 'json'});

		// If there's no wizard data
		if (wizard === null) {
			return new Response('Wizard not found', {
				status: 404,
				headers: headers
			});
		}

		// Otherwise, return the wizard data
		return new Response(JSON.stringify({
			wizard: wizard
		}), {
			status: 200,
			headers: headers
		});

	}

	// Handle the PUT method
	if (request.method === 'PUT') {

		// Get the request body
		let body = await request.json();

		// Save or update the data in the database
		let data = {
			spell: body.spell,
			pet: body.pet
		};
		let wizard = await WIZARDS.put(body.wizard, JSON.stringify(data));

		// If the wizard wasn't saved
		if (wizard === null) {
			return new Response('Wizard not saved', {
				status: 404,
				headers: headers
			});
		}

		// Otherwise, return the wizard data
		return new Response(JSON.stringify({
			wizard: data
		}), {
			status: 200,
			headers: headers
		});

	}

	// Handle the POST method
	if (request.method === 'POST') {

		// Get the request body
		let body = await request.json();

		// Check if the item already exists
		let existing = await WIZARDS.get(body.wizard);
		if (existing) {
			return new Response('Wizard already exists', {
				status: 409,
				headers: headers
			});
		}

		// Save or update the data in the database
		let data = {
			spell: body.spell,
			pet: body.pet
		};
		let wizard = await WIZARDS.put(body.wizard, JSON.stringify(data));

		// If the wizard wasn't saved
		if (wizard === null) {
			return new Response('Wizard not saved', {
				status: 404,
				headers: headers
			});
		}

		// Otherwise, return the wizard data
		return new Response(JSON.stringify({
			wizard: data
		}), {
			status: 200,
			headers: headers
		});

	}

	// Handle the DELETE method
	if (request.method === 'DELETE') {

		// Get the request body
		let body = await request.json();

		// Delete the wizard from the database
		let wizard = await WIZARDS.delete(body.wizard);

		// Confirm the deletion
		return new Response(JSON.stringify({
			wizard: body.wizard
		}), {
			status: 200,
			headers: headers
		});

	}

}

// Listen for API calls
addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request));
});