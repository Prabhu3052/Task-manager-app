import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/Taskform';
import TaskList from './components/Tasklist';
import './App.css';


const API_BASE_URL = 'https://task-manager-app-m0al.onrender.com';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, {
        completed: !task.completed
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling complete:', error);
      setError('Failed to update task status. Please try again.');
    }
  };


  const filteredTasks = priorityFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.priority === priorityFilter);


  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  return (
    <div className="app">
      <h1>Task Manager</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <TaskForm 
        onAddTask={addTask} 
        editingTask={editingTask}
        onUpdateTask={updateTask}
        onCancelEdit={() => setEditingTask(null)}
      />
      
      <div className="controls">
        <div className="filter-controls">
          <label>Filter by Priority:</label>
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">None</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList 
          tasks={sortedTasks} 
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
        />
      )}
    </div>
  );
}

export default App;