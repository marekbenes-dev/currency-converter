import { Converter } from "../converter/converter";

export function meta() {
  return [
    { title: "Currency converter" },
    { name: "description", content: "Welcome to currency converter!" },
  ];
}

export default function Home() {
  return <Converter />;
}
