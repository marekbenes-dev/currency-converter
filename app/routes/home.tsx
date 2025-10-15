import { Converter } from "../converter/converter";

export function meta() {
  return [
    { title: "Currency convertor" },
    { name: "description", content: "Welcome to currency convertor!" },
  ];
}

export default function Home() {
  return <Converter />;
}
