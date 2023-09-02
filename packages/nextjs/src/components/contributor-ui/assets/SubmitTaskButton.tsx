import React from "react";
import Link from "next/link";
import { MetaHeader } from "~~/src/components/MetaHeader";

const SubmitTaskButton = () => {
  return (
    <>
      <MetaHeader />
      <div>
        <Link href="/contributor-form" passHref className="link">
          Submission Form
        </Link>{" "}
      </div>
    </>
  );
};

export default SubmitTaskButton;
