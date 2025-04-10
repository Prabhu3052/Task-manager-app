import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/Taskform';
import TaskList from './components/Tasklist';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', taskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        completed: !task.completed
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  // Filter tasks by priority
  const filteredTasks = priorityFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.priority === priorityFilter);

  // Sort tasks
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

      <TaskList 
        tasks={sortedTasks} 
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onToggleComplete={toggleComplete}
      />
    </div>
  );
}

export default App;