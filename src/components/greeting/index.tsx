import React from "react";

interface GreetingProps {
	name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
	return <h1 className="text-2xl font-bold">Hello, {name}!</h1>;
};

export default Greeting;
