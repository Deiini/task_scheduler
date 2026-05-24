import React from 'react';

interface Agent {
  id: number;
  name: string;
  os: string;
  is_active: boolean;
}

const AgentList: React.FC = () => {
  const [agents, setAgents] = React.useState<Agent[]>([]);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/v1/agents/', {
      headers: {
        'Authorization': 'Bearer admin_token'
      }
    })
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);

  return (
    <div>
      <h1>Agents</h1>
      <ul>
        {agents.map(agent => (
          <li key={agent.id}>{agent.name} ({agent.os})</li>
        ))}
      </ul>
    </div>
  );
};

export default AgentList;
