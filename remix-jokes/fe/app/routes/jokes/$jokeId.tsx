import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import type { Joke } from "~/utils/types";

export const loader: LoaderFunction = async ({ params }) => {
	const response = await fetch(`http://localhost:4000/jokes/${params.jokeId}`);
	if (response.status <= 200 && response.status >= 299)
		throw new Error("Joke not found");
	return await response.json();
};

export default function JokeRoute() {
	const data = useLoaderData<Joke>();

	return (
		<div>
			<p>Here's your hilarious joke:</p>
			<p>{data.content}</p>
			<Link to=".">{data.name} Permalink</Link>
		</div>
	);
}
