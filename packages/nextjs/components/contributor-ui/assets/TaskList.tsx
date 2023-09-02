export const TaskList = () => {
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <div>
          <h1>Approved</h1>

          <div>
            <p>NFTs Pending to be claimed</p>
          </div>
          <div>
            <p>NFTs claimed but not executed</p>
          </div>
          <div>
            <p>NFT alredy burned</p>
          </div>
        </div>
        <div>
          <h1>Rejected</h1>
        </div>
      </div>
    </div>
  );
};
