// components/contributor-ui/SubmitForm.tsx
import React, { ChangeEvent, FormEvent, useState } from "react";

const SubmitForm = () => {
  const [githubValue, setGithubValue] = useState("");
  const [priceValue, setPriceValue] = useState("");

  const handleGithubChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGithubValue(event.target.value);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPriceValue(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Send a POST request to the Next.js API route
      const response = await fetch("/api/create-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubValue, priceValue }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert("Request creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the request.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Commit Github Id:
          <input type="text" value={githubValue} onChange={handleGithubChange} />
        </label>
        <label>
          Price:
          <input type="number" value={priceValue} onChange={handlePriceChange} />
        </label>
        <button disabled={!githubValue || !priceValue} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitForm;
