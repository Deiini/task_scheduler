import React from 'react';

interface Task {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/v1/tasks/', {
      headers: {
        'Authorization': 'Bearer admin_token'
      }
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
