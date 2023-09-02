import React, { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

// //For the transaction
// import { useDebounce } from 'use-debounce'
// import { usePrepareSendTransaction } from 'wagmi'
// import { parseEther } from 'viem'

class SubmitForm extends React.Component<NonNullable<unknown>, { githubValue: string; priceValue: string }> {
  constructor(props: NonNullable<unknown>) {
    super(props);
    this.state = { githubValue: "", priceValue: "" };

    this.handleGithubChange = this.handleGithubChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleGithubChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ githubValue: event.target.value });
  }

  handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ priceValue: event.target.value });
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Corrected parameter type
    alert("GitHub ID: " + this.state.githubValue + "\nPrice: " + this.state.priceValue);
    event.preventDefault();

    // // Use the useRouter hook to navigate to the "thanks-submitting" page
    // const router = useRouter();
    // router.push('/contributor'); // Replace with the actual path to your "thanks-submitting" page
  }

  //For the transaction

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Commit Github Id:
            <input type="text" value={this.state.githubValue} onChange={this.handleGithubChange} />
          </label>
          <label>
            Price:
            <input type="number" value={this.state.priceValue} onChange={this.handlePriceChange} />
          </label>
          <button disabled={!this.state.priceValue || !this.state.githubValue} type="submit">
            Submit
          </button>
        </form>
        <Link legacyBehavior href="/contributor">
          <a>Go back</a>
        </Link>
      </div>
    );
  }
}

export { SubmitForm };
