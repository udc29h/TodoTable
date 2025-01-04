import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

function TaskListManager() {
  const [tasks, setTasks] = useState([]);
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
  });

  // Fetch tasks from API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => {
        // Process first 20 tasks
        const processedTasks = data.slice(0, 20).map((task) => ({
          id: task.id,
          title: task.title,
          description: task.title, // Using title as description for simplicity
          status: task.completed ? 'Done' : 'To Do',
        }));
        setTasks(processedTasks);
      });
  }, []);

  // Initialize Tabulator once
  useEffect(() => {
    if (tableRef.current && !tabulatorRef.current) {
      const table = new Tabulator(tableRef.current, {
        data: tasks,
        layout: 'fitColumns',
        height: '311px',
        columns: [
          { 
            title: 'Task ID', 
            field: 'id', 
            width: 100, 
            headerSort: false 
          },
          {
            title: 'Title',
            field: 'title',
            editor: 'input',
            headerFilter: 'input',
          },
          { 
            title: 'Description', 
            field: 'description', 
            editor: 'input' 
          },
          {
            title: 'Status',
            field: 'status',
            width: 150,
            editor: 'list',
            editorParams: {
              values: ['To Do', 'In Progress', 'Done'],
            },
            formatter: 'lookup',
            formatterParams: {
              'To Do': 'To Do',
              'In Progress': 'In Progress',
              'Done': 'Done',
            },
            cellEdited: (cell) => {
              const rowData = cell.getRow().getData();
              setTasks(prevTasks => 
                prevTasks.map(task => 
                  task.id === rowData.id 
                    ? { ...task, status: cell.getValue() } 
                    : task
                )
              );
            },
          },
          {
            title: 'Actions',
            width: 100,
            field: 'actions',
            formatter: () => '<button class="delete-btn">Delete</button>',
            cellClick: (e, cell) => {
              const taskId = cell.getRow().getData().id;
              cell.getRow().delete();
              setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            },
          },
        ],
      });

      tabulatorRef.current = table;
    }
  }, []);

  // Update table data when tasks change
  useEffect(() => {
    if (tabulatorRef.current) {
      tabulatorRef.current.setData(tasks);
    }
  }, [tasks]);

  // Handle new task submission
  const handleNewTaskSubmit = (e) => {
    e.preventDefault();
    const taskToAdd = {
      ...newTask,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    };
    
    setTasks(prevTasks => [...prevTasks, taskToAdd]);

    // Reset form
    setNewTask({
      title: '',
      description: '',
      status: 'To Do',
    });
  };

  // Render tasks counters
  const taskCounters = {
    'To Do': tasks.filter((task) => task.status === 'To Do').length,
    'In Progress': tasks.filter((task) => task.status === 'In Progress').length,
    'Done': tasks.filter((task) => task.status === 'Done').length,
  };

  return (
    <div className="container mx-auto p-12">
      <h1 className="text-2xl font-bold mb-4">Task List Manager</h1>

      <div className="grid">
        {/* Task Counters */}
        <div className="mb-4 flex space-x-4">
          {Object.entries(taskCounters).map(([status, count]) => (
            <div key={status} className="p-2 bg-red-200 rounded">
              {status}: {count}
            </div>
          ))}
        </div>

        {/* New Task Form */}
        <form onSubmit={handleNewTaskSubmit} className="bg-gray-100 p-4 rounded">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-1 border rounded"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task Table */}
      <div ref={tableRef} className="mb-4"></div>
    </div>
  );
}

export default TaskListManager;