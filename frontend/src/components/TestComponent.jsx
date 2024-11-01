import React, { useEffect } from "react";
import useFetchAccounts from "../hooks/useFetchAccount";
export default function TestComponent() {
  const { data, error, loading } = useFetchAccounts();

  console.log(localStorage.getItem('jwtToken'));

  // Log data after it has been fetched and updated
  console.log("Fetched Data:", data);

  return (
    <div>
      <h1>Hello World</h1>
      <img src="image.png" /> {/* Missing alt attribute */}
      {/* {loginError && <p style={{ color: "red" }}>{loginError}</p>} */}
    </div>
  );
}
