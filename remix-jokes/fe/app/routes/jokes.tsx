import { LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Outlet, Link } from "remix";

import stylesUrl from "~/styles/jokes.css";
import { getUsername } from "~/utils/session.server";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
	jokeListItems: Array<{ id: string; name: string }>;
	username: string;
};

export const loader: LoaderFunction = async ({ request }) => {
	const response = await fetch(`http://localhost:4000/jokes`);
	const username = await getUsername(request);
	return { jokeListItems: await response.json(), username };
};

export default function JokesRoute() {
	const data = useLoaderData<LoaderData>();
	return (
		<div className="jokes-layout">
			<header className="jokes-header">
				<div className="container">
					<h1 className="home-link">
						<Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
							<span className="logo">🤪</span>
							<span className="logo-medium">J🤪KES</span>
						</Link>
					</h1>
					{data.username ? (
						<div className="user-info">
							<span>{`Hi ${data.username}`}</span>
							<form action="/logout" method="post">
								<button type="submit" className="button">
									Logout
								</button>
							</form>
						</div>
					) : (
						<Link to="/login">Login</Link>
					)}
				</div>
			</header>
			<main className="jokes-main">
				<div className="container">
					<div className="jokes-list">
						<Link to=".">Get a random joke</Link>
						<p>Here are a few more jokes to check out:</p>
						<ul>
							{data.jokeListItems.map((joke: any) => (
								<li key={joke.id}>
									<Link to={joke.id}>{joke.name}</Link>
								</li>
							))}
						</ul>
						<Link to="new" className="button">
							Add your own
						</Link>
					</div>
					<div className="jokes-outlet">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
