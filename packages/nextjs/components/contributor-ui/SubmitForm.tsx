import React, { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

class SubmitForm extends React.Component<NonNullable<unknown>, { value: string }> {
  constructor(props: NonNullable<unknown>) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Corrected parameter type
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();

    // // Use the useRouter hook to navigate to the "thanks-submitting" page
    // const router = useRouter();
    // router.push('/contributor'); // Replace with the actual path to your "thanks-submitting" page
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Commit Github Id:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <Link legacyBehavior href="/contributor">
          <a>Submit</a>
        </Link>
      </form>
    );
  }
}

export { SubmitForm };
