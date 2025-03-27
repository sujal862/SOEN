import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Project() {
  const location = useLocation(); // Accessing props passed by navigate function

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  console.log(location.state);

  return (
    <main className="h-screen w-screen flex">
      <section className="left flex flex-col h-full min-w-96 bg-gray-100 relative">
        {/* Header */}
        <header className="flex justify-between items-center p-2 px-4 w-full bg-gray-200">

          <button
          className='flex gap-2'
          >
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>

          <button className="p-2 text-gray-700 cursor-pointer hover:text-gray-900"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="conversation-area flex flex-col flex-grow">
          {/* Message Box */}
          <div className="message-box flex-grow flex flex-col bg-white border border-gray-300 rounded-md p-2 gap-1">
            {/* Incoming Message */}
            <div className="incoming max-w-56 flex flex-col p-2 bg-slate-100 w-fit rounded-md">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">Lorem ipsum dolor sit damet consct</p>
            </div>

            {/* Outgoing Message */}
            <div className="outgoing max-w-56 ml-auto flex flex-col p-2 bg-slate-100 w-fit rounded-md">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">Lorem ipsum dolor sit damet consct</p>
            </div>
          </div>

          {/* Input Field */}
          <div className="inputField w-full flex items-center ">
            <input
              className="p-2 px-4 flex-grow border-none outline-none"
              type="text"
              placeholder="Enter message"
            />
            <button className="p-2 px-4  bg-blue-600 text-white hover:bg-blue-700">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        {/* side Pannel*/}
        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>

          <header
            className='flex justify-end p-2 px-4 w-full bg-gray-200'
          >

            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 text-gray-700 cursor-pointer hover:text-gray-900"
            >
              <i className="ri-close-line font-bold"></i>
            </button>

          </header>


          <div className="user-list flex flex-col gap-2 p-2">

            <div className="user flex cursor-pointer hover:bg-gray-200 gap-2 p-1 items-center">

              <div className="aspect-square w-fit h-fit rounded-full flex justify-center items-center p-4 bg-gray-500">
                <i className="ri-user-fill text-white absolute"></i>
              </div>

              <h1
                className='font-semibold tex-lg'
              >username</h1>

            </div>

          </div>

        </div>

      </section>




    </main>
  );
}

export default Project;