import { ProjectList } from "../components/contributor-ui/ProjectList";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const ContributorUI: NextPage = () => {
  return (
    <>
      <MetaHeader title="Contributors board" description="Board where it's displayed the DAO projects">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        <ProjectList />
      </div>
    </>
  );
};

export default ContributorUI;
