export const TaskList = () => {

  return (
    <div className="flex flex-col justify-center item-center px-4 md:px-0">
      <h1 className="text-center mb-10">Your approved tasks are:</h1>
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl bg-base-300 pb-10 pt-10">
        <div>
          

          <div>
            <form  name="retreiveform">
              <div className="flex flex-grow item-center justify-around mb-10 bg-base-300">
                <label>
                  <p className="ml-10 text-bold gap-12">Task ID: 64; Amount available to retreive: 50</p>
                  <input className="ml-10 text-black gap-12" type="payment" name="expected-amount" step="any"/>
                  <button className="border-solid ml-10 bg-base-100 pt-5 pb-5 pl-10 pr-10">Redeem</button>
                </label>
              </div>
              
  

            </form>
          </div>

        </div>
          
      </div>
    </div>
  );
};
