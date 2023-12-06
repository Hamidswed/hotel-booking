import { useSearchParams } from "react-router-dom";

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
const destination = searchParams.get("destination")

console.log(destination);

  return (
    <div>
      <h1>hotels</h1>
    </div>
  );
}
