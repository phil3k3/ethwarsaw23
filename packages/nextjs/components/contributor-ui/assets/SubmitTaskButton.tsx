import React from "react";
import Link from "next/link";

const SubmitTaskButton = () => {
  return (
    <>
    <div className="flex flex-col border border-primary rounded-2xl p-1 flex-shrink-0 pl-10 pr-10 mt-10 mb-10">
      <button>
          <Link href="/contributor-form" passHref className="link">
            Submission Form
          </Link>{" "}
        </button>
    </div>
     
    </>
  );
};

export default SubmitTaskButton;
