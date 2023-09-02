import SubmitTaskButton from "./assets/SubmitTaskButton";
import { TaskList } from "./assets/TaskList";

export const ProfileContributor = () => {
  return (
    <div className="flex items-center flex-col flex-grow mt-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-base-300 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl max-h-[64px] mb-4">
          Contributor Dashboard
        </h1>

        <div className="text-center ">
          <div className="flex items-center justify-center mb-10">
            <SubmitTaskButton />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-around">
        <div className="w-[75vw]">
          <TaskList />
        </div>
      </div>
    </div>
  );
};
