
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios.jsx';
import { useUser } from '../context/user.context.jsx'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.jsx';

function Project() {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState({});
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const messageBox = useRef(null);

  useEffect(() => {
    const projectId = location.state.project._id;
    axios.get(`/projects/get-project/${projectId}`)
      .then((res) => {
        setProject(res.data.project);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get('/users/all')
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  useEffect(() => {
    if (project._id) {
      // Socket connection
      const socket = initializeSocket(project._id);

      receiveMessage('project-message', data => {
        console.log('Received message', data);
        appendIncomingMessage(data);
        scrollToBottom(); // Scroll to bottom when a new message is received
      });

      // Clean up socket connection on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [project]); // Only run when project changes


  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const AddCollabortors = () => {
    const projectId = location.state.project._id;
    axios.put('/projects/add-user', { projectId, users: selectedUsers })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const send = () => {
    if (message.trim() === "") return;
    const messageData = {
      message,
      sender: user.email
    };
    console.log('sending', message);
    sendMessage('project-message', messageData);
    appendOutgoingMessage(message);
    scrollToBottom(); 
    setMessage('');
  }

  //function to scroll to bottom
  const scrollToBottom = () => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  };

  const appendIncomingMessage = (messageObject) => {

    const newMessage = document.createElement('div');
    newMessage.classList.add('incoming', 'max-w-56', 'flex', 'flex-col', 'p-2', 'mb-2', 'bg-slate-100', 'w-fit', 'rounded-md');
    newMessage.innerHTML = `
        <small class="opacity-65 text-xs">${messageObject.sender}</small>
        <p class="text-sm">${messageObject.message}</p>
      `;

    messageBox.current.appendChild(newMessage);

  }

  const appendOutgoingMessage = (message) => {
    const newMessage = document.createElement('div');
    newMessage.classList.add('outgoing', 'max-w-56', 'ml-auto', 'flex', 'flex-col', 'p-2', 'mb-2', 'bg-slate-100', 'w-fit', 'rounded-md');
    newMessage.innerHTML = `
        <small class="opacity-65 text-xs">${user.email}</small>
        <p class="text-sm">${message}</p>
      `;

    messageBox.current.appendChild(newMessage);
  }

  return (
    <main className="h-screen w-screen flex">
      <section className="left flex flex-col h-screen min-w-96 bg-gray-100 relative">
        {/* Header */}
        <header className="flex justify-between items-center p-2 px-4 w-full absolute bg-gray-200 top-0 left-0 right-0 z-10">
          <button
            className="flex gap-2 items-center hover:bg-gray-300 px-2 py-1 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>

          <button
            className="p-2 text-gray-700 cursor-pointer hover:text-gray-900"
            onClick={() => {
              console.log('clicked');
              setIsSidePanelOpen(!isSidePanelOpen)
            }}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="conversation-area flex flex-col h-screen pt-14 pb-16">
          <div className="flex-grow flex flex-col overflow-hidden">
            <div
              ref={messageBox}
              className="message-box flex-grow overflow-y-auto bg-white border border-gray-300 rounded-md p-2 gap-1"
            >
              {/* Messages will be appended here */}
            </div>
          </div>

          <div className="inputField w-full flex items-center absolute bottom-0 left-0 right-0 bg-white p-2">
            <input
              className="p-2 px-4 flex-grow border-none outline-none"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
            />
            <button
              className="p-2 px-4 bg-blue-600 text-white hover:bg-blue-700"
              onClick={send}
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
          <header className="flex justify-between items-center p-2 px-4 w-full bg-gray-200">
            <h1 className="font-semibold">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 text-gray-700 cursor-pointer hover:text-gray-900"
            >
              <i className="ri-close-line font-bold"></i>
            </button>
          </header>

          <div className="user-list flex flex-col gap-2 p-2">
            {project.users && project.users.map(user => (
              <div
                key={user._id}
                className="user flex cursor-pointer hover:bg-gray-200 gap-2 p-1 items-center"
              >
                <div className="aspect-square w-fit h-fit rounded-full flex justify-center items-center p-4 bg-gray-500">
                  <i className="ri-user-fill text-white absolute"></i>
                </div>
                <h1 className="font-semibold tex-lg">{user.email}</h1>
              </div>
            ))}
          </div>
        </div>
            


      </section>

      {/* User Selection Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-gray-100 opacity-70 z-40"></div>

          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Select Users</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                {users.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                    className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user._id)
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <i className="ri-user-fill text-gray-600"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                    {selectedUsers.includes(user._id) && (
                      <i className="ri-check-line ml-auto text-indigo-600 text-xl"></i>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      AddCollabortors();
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Add Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default Project;