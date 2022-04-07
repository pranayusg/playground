import { LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = async () => {
	const res = await fetch("https://jsonplaceholder.typicode.com/todos");
	return res.json();
};

export default function datatestRoute() {
	const data = useLoaderData();
	return (
		<ul>
			{data.map((obj: any) => (
				<li key={obj.id}>{obj.title}</li>
			))}
		</ul>
	);
}
