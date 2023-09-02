import React from "react";
import Link from "next/link";

const SubmitTaskButton = () => {
  return (
    <>
      <button>
        <Link href="/contributor-form" passHref className="link">
          Submission Form
        </Link>{" "}
      </button>
    </>
  );
};

export default SubmitTaskButton;
