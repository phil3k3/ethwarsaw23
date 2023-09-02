import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import SubmitForm from "~~/components/contributor-ui/SubmitForm";

const ContributorForm: NextPage = () => {
  return (
    <>
      <MetaHeader title="Contributors board Form" description="Board where it's displayed the DAO projects">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="flex flex-col items-center flex-grow pt-10" data-theme="contributorUIForm">
        <h1>Submit your work for review</h1>
        <SubmitForm />
      </div>
    </>
  );
};

export default ContributorForm;
