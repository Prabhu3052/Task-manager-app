function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
    const priorityColors = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    };
  
    return (
      <div className={`task-item ${task.completed ? 'completed' : ''}`}>
        <div className="task-info">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
          <span className="task-title">{task.title}</span>
          <span 
            className="priority-badge" 
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {task.priority}
          </span>
        </div>
        <div className="task-actions">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    );
  }
  
  export default TaskItem;