import { useState } from 'react';

function TaskForm({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [priority, setPriority] = useState(editingTask?.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const taskData = { title, priority };
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
    
    setTitle('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task..."
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">{editingTask ? 'Update' : 'Add'} Task</button>
      {editingTask && <button type="button" onClick={onCancelEdit}>Cancel</button>}
    </form>
  );
}

export default TaskForm;