import http, { IncomingMessage, ServerResponse } from "http"; // The core Node module we're using to build our server.
import { url } from "inspector";
import { json } from "stream/consumers";
import { parseJsonText } from "typescript";

const hostname = "127.0.0.1"; // or 'localhost'
const port = 3000;

const server = http.createServer(
	(req: IncomingMessage, res: ServerResponse) => {
		// Request handling will come later!
		// Inside createServer(...)

		if (req.method === "GET" && req.url === "/") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");

			res.end(
				JSON.stringify(
					{ message: "Hello from the Pokemon Server!" },
					null,
					2,
				),
			);
		} else if (req.method === "GET" && req.url === "/pokemon") {
			// Existing: Get all Pokemon ...
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");

			res.end(
				JSON.stringify(
					{ message: "All Pokemon:", payload: database },
					null,
					2,
				),
			);
		} else if (req.method === "GET" && req.url?.startsWith("/pokemon/")) {
			// Find Pokemon by ID
			const urlParts = req.url.split("/");
			const pokemonId = parseInt(urlParts[2]);

			const foundPokemon = database.find(
				(pokemon) => pokemon.id === pokemonId,
			);

			if (foundPokemon) {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify(
						{ message: "Pokemon found", payload: foundPokemon },
						null,
						2,
					),
				);
			} else {
				res.statusCode = 404;
				res.end(
					JSON.stringify({ message: "Pokemon not found" }, null, 2),
				);
			}
		} else if (req.method === "POST" && req.url === "/pokemon") {
			let body = ""; // To store incoming data
			req.on("data", (chunk) => {
				body += chunk.toString();
			});

			req.on("end", () => {
				const newPokemon = JSON.parse(body);
				// Add basic data logic (you'd likely use a database in a real application)
				newPokemon.id = database.length + 1; // Simple ID assignment
				database.push(newPokemon);
				res.statusCode = 201; // 'Created'
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify(
						{ message: "Pokemon created!", payload: newPokemon },
						null,
						2,
					),
				);
			});
		} else if (req.method === "PUT" && req.url?.startsWith("/pokemon/")) {
			// Find Pokemon by ID
			const urlParts = req.url.split("/");
			const pokemonId = parseInt(urlParts[2]);

			let body = ""; // To store incoming data
			req.on("data", (chunk) => {
				body += chunk.toString();
			});

			req.on("end", () => {
				let pokemonToUpdate = database.find(
					(pokemon) => pokemon.id === pokemonId,
				);
				let pokemonIndex = database.findIndex(
					(pokemon) => pokemon.id === pokemonId,
				);

				if (pokemonToUpdate) {
					const pokemonUpdates: Partial<Pokemon> = JSON.parse(body);

					res.statusCode = 204;
					database[pokemonIndex] = {
						...pokemonToUpdate,
						...pokemonUpdates,
					};
					res.setHeader("Content-Type", "application/json");
					res.end(
						JSON.stringify({ message: "Pokemon updated" }, null, 2),
					);
				} else {
					res.statusCode = 404;
					res.end(
						JSON.stringify(
							{ message: "Pokemon not found" },
							null,
							2,
						),
					);
				}
			});
		} else if (
			req.method === "DELETE" &&
			req.url?.startsWith("/pokemon/")
		) {
			// Find Pokemon by ID
			const urlParts = req.url.split("/");
			const pokemonId = parseInt(urlParts[2]);

			let pokemonIndex = database.findIndex(
				(pokemon) => pokemon.id === pokemonId,
			);

			// let pokemonIndex = database.findIndex(pokemon => pokemon.id === pokemonId);
			// console.log(pokemonIndex)

			if (pokemonIndex != -1) {
				res.statusCode = 204;
				database.splice(pokemonIndex, 1);
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify({ message: "Pokemon deleted" }, null, 2),
				);
			} else {
				res.statusCode = 404;
				res.end(
					JSON.stringify({ message: "Pokemon not found" }, null, 2),
				);
			}
		}
	},
);

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

// =========================================================================================================
// =========================================================================================================

interface Pokemon {
	id: number;
	name: string;
	type: string;
}

const database: Pokemon[] = [
	// Add one Pokemon object here with ID 1.
	{ id: 1, name: "Bulbasaur", type: "Grass/Poison" },
];
