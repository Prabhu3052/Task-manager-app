import TaskItem from './Taskitem';

function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>No tasks found. Add a task to get started!</p>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;