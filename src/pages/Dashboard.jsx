import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from "../../firebase.config"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
// Dashboard.jsx
import useAuthStore from '../store/authStore'; // Ensure this is the correct path
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../components/Navbar";

console.log(db)

// Zod schema for task validation
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["To Do", "In Progress", "Done"]),
});

const Dashboard = () => {
  const  {user}  = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [logs, setLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const tasksCollection = collection(db, "tasks");
  const logsCollection = collection(db, "logs");

  // Refs to track latest state
  const tasksRef = useRef(tasks);
  const loadingRef = useRef(loading);

  // Sync refs with current state
  useEffect(() => {
    tasksRef.current = tasks;
    loadingRef.current = loading;
  }, [tasks, loading]);

  // Fetch tasks and logs on component mount
  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, []);



  // Fetch tasks from Firestore
  const fetchTasks = async () => {
  
    
    setLoading(true);
    try {
      const snapshot = await getDocs(tasksCollection);
      const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs from Firestore
  const fetchLogs = async () => {
    try {
      const snapshot = await getDocs(logsCollection);
      const logsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort logs by timestamp in descending order (latest first)
      logsData.sort((a, b) => b?.timestamp?.toDate() - a?.timestamp?.toDate());
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Log activity to Firestore
  const logActivity = async (message) => {
    try {
      const logEntry = {
        message,
        timestamp: new Date(),
        updatedBy: user?.name || user?.email, // Use displayName or email as the user identifier
      };
      await addDoc(logsCollection, logEntry);
      fetchLogs(); // Refresh logs after adding a new one
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  // Handle form submission to add a new task
  const onSubmit = async (data) => {
    try {
      const newTask = { ...data, createdBy: user.uid };
      await addDoc(tasksCollection, newTask); // Ensure this line is executed
      await logActivity(`Task "${data.title}" created.`);
      fetchTasks(); // Refresh tasks after adding a new one
      reset(); // Reset the form
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Update a task in Firestore
  const updateTask = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "tasks", id), updatedData);
      await logActivity(`Task updated: ${updatedData.title}`);
      fetchTasks(); // Refresh tasks after updating
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  

  // Delete a task from Firestore
  const deleteTask = async (id) => {
    try {
      const task = tasks.find((task) => task.id === id);
      if (task) {
        await deleteDoc(doc(db, "tasks", id));
        await logActivity(`Task "${task.title}" deleted.`);
        fetchTasks(); // Refresh tasks after deleting
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Move a task to a new status
  const moveTask = async (id, newStatus) => {
    if (loadingRef.current) return;
  
    // Always use ref to get latest tasks
    const task = tasksRef.current.find((t) => t.id === id);
    if (!task) return;
  
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  
    // Firestore update
    await updateDoc(doc(db, "tasks", id), { status: newStatus });
    await logActivity(`Moved "${task.title}" to ${newStatus} by ${user.displayName || user.email}`);
    fetchTasks(); // Re-fetch to sync
  };


  // Filter and sort tasks
  const filteredTasks = tasks
  // Filter by title (search bar)
  .filter((task) => task.title?.toLowerCase().includes(search?.toLowerCase()))
  
  // Filter by priority
  .filter((task) => filterPriority === "All" || task.priority === filterPriority)
  
  // Sort by due date
  .sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.dueDate) - new Date(b.dueDate); // Ascending order
    } else {
      return new Date(b.dueDate) - new Date(a.dueDate); // Descending order
    }
  });
  return (
    <DndProvider backend={HTML5Backend}>
         <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Task Dashboard</h2>

        {/* Search Input */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Search tasks..."
        />

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          
          <select
            className="p-2 border rounded"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-gray-500 text-white py-2 px-4 rounded mb-4"
        >
  Sort {sortOrder === "asc" ? "Newest First" : "Earliest First"}
  </button>
        </div>

        {/* Sort Button */}
       

        {/* Task Form */}
       {/* Task Form */}
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
    <label htmlFor="title" className="sr-only">Title</label>
    <input
      id="title"
      className="w-full p-2 border rounded"
      placeholder="Title"
      {...register("title")}
      aria-invalid={errors.title ? "true" : "false"}
    />
    {errors.title && (
      <p className="text-red-500" role="alert">{errors.title.message}</p>
    )}
  </div>

  <div>
    <label htmlFor="description" className="sr-only">Description</label>
    <textarea
      id="description"
      className="w-full p-2 border rounded"
      placeholder="Description"
      {...register("description")}
    />
  </div>

  <div>
    <label htmlFor="dueDate" className="block mb-1 text-sm">Due Date</label>
    <input
      id="dueDate"
      className="w-full p-2 border rounded"
      type="date"
      {...register("dueDate")}
    />
  </div>

  <div>
    <label htmlFor="priority" className="block mb-1 text-sm">Priority</label>
    <select
      id="priority"
      className="w-full p-2 border rounded"
      {...register('priority')}
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  </div>

  <div>
    <label htmlFor="status" className="block mb-1 text-sm">Status</label>
    <select
      id="status"
      className="w-full p-2 border rounded"
      {...register('status')}
    >
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  </div>

  <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
    Add Task
  </button>
</form>

        {/* Task Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 m-4 p-4">
  {["To Do", "In Progress", "Done"].map((status) => (
    <TaskColumn
      key={status}
      status={status}
      tasks={filteredTasks}
      moveTask={moveTask}
      deleteTask={deleteTask}
      updateTask={updateTask}
    />
  ))}
</div>

        {/* Activity Logs */}
        <h4 className="text-lg font-semibold mb-2">Activity Logs</h4>
        <div className="mt-6 p-4 bg-white shadow rounded max-h-[200px] overflow-auto">
  <ul>
    {logs.map((log) => (
      <li key={log.id} className="text-gray-700 mb-2">
        <div className="flex justify-between">
          <span>{log.message}</span>
          <span className="text-xs text-gray-500">
            {log?.timestamp?.toDate()?.toLocaleString()} • {log.updatedBy}
          </span>
        </div>
      </li>
    ))}
  </ul>
</div>
      </div>
    </DndProvider>
  );
};

// TaskColumn Component
// TaskColumn.jsx
const TaskColumn = ({ status, tasks, moveTask, deleteTask, updateTask }) => {
  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, status),
  }));

  return (
    <div ref={drop} className="p-4 border rounded bg-gray-50 min-w-[12rem]"
>
      <h3 className="text-xl font-bold mb-2">{status}</h3>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask} // Pass updateTask as a prop
          />
        ))}
    </div>
  );
};


// TaskCard.jsx
const TaskCard = ({ task, deleteTask, updateTask }) => {
  const [, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(task.title);
  const [updatedDescription, setUpdatedDescription] = useState(task.description);
  const [updatedDueDate, setUpdatedDueDate] = useState(task.dueDate);
  const [updatedPriority, setUpdatedPriority] = useState(task.priority);

  const handleUpdate = async () => {
    const updatedData = {
      title: updatedTitle,
      description: updatedDescription,
      dueDate: updatedDueDate,
      priority: updatedPriority,
    };
    await updateTask(task.id, updatedData); // Ensure this line is executed
    setIsEditing(false); // Close the edit form
  };

  return (
    <div ref={drag} className="p-4 bg-white rounded shadow mb-2 cursor-move">
      {isEditing ? (
        // Edit Form
        <div className="space-y-2">
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />
          <input
            type="date"
            value={updatedDueDate}
            onChange={(e) => setUpdatedDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={updatedPriority}
            onChange={(e) => setUpdatedPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-blue-500 text-white py-1 rounded cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-500 text-white py-1 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Task Details
        <>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Priority: {task.priority}</span>
            <span className="text-xs text-gray-500">{task.dueDate}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-yellow-500 text-white py-1 rounded text-xs cursor-pointer"
            >
              Update
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="flex-1 bg-red-500 text-white py-1 rounded text-xs cursor-pointer"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};


export default Dashboard;