import { Link, LoaderFunction, useLoaderData } from "remix";
import { Joke } from "~/utils/types";

export const loader: LoaderFunction = async () => {
	const response = await fetch(`http://localhost:4000/jokes/random`);
	return await response.json();
};

export default function JokesIndexRoute() {
	const data = useLoaderData<Joke>();
	return (
		<div>
			<p>Here's a random joke:</p>
			<p>{data.content}</p>
			<Link to={data.id}>"{data.name}" Permalink</Link>
		</div>
	);
}
