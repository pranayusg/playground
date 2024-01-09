const Header = ({ title }: { title: string }) => {
	return (
		<h1 title="Header" className="font-bold text-3xl text-center">
			{title}
		</h1>
	);
};

export default Header;
