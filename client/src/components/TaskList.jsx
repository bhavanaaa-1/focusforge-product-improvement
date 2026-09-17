import { updateTask, deleteTask } from "../api/taskApi";

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  const handleToggle = async (id, completed) => {
    try {
      const updatedTask = await updateTask(id, !completed);
      onTaskUpdated(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      onTaskDeleted(id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id, task.completed)}
              />
              <span>{task.title}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(task.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
