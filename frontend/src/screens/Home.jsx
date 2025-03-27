import React, { useState, useEffect } from 'react'
import { useUser } from '../context/user.context'
import axios from '../config/axios.jsx'
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    axios.post('/projects/create', { name: projectName })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(projectName);
  }

  useEffect(() => { // get all projects of loggen in user

    axios.get('/projects/all').then((res) => {
      setProject(res.data.projects);

    }).catch(err => {
      console.log(err);
    })

  }, [])

  return (
    <main className='p-4'>
      <div className="projects flex flex-wrap gap-3">
        {/* Button to open modal */}
        <button
          className="mt-4 px-4 py-2  text-black rounded-md border-2 border-gray-300"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {
          project.map((project) => (
            <div key={project._id}
              onClick={() => {
                navigate('/project', { state: {project}})
              }}
              className='project flex flex-col gap-2 cursor-pointer px-4 py-2 rounded-md border-2 border-slate-300 min-w-52 hover:bg-slate-200'>
              <h2
                className='font-semibold'
              >
                {project.name}
              </h2>

              <div className='flex gap-2'>
                <p> <small><i className="ri-user-line"></i></small>  <small>Collaborators</small>: </p>
                {project.users.length}  {/* num of users in this project */}
              </div>

            </div>
          ))
        }

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form
              onSubmit={createProject}
            >
              <div className="mb-4">
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  id="projectName"
                  name="projectName"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  )
}
