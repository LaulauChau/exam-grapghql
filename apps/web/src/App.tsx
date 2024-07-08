import { useEffect, useState } from "react";

export function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
