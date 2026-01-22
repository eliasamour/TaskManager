import { useState } from "react";
import AppShell from "../components/AppShell";
import SidebarLists from "../components/SidebarLists";
import TasksPanel from "../components/TasksPanel";
import TaskDetailsPanel from "../components/TaskDetailsPanel";

export default function AppPage() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);

  function selectList(id: string) {
    setSelectedListId(id ? id : null);
    setSelectedTaskId(null);
    setTasksRefreshKey((k) => k + 1);
  }

  return (
    <AppShell
      left={<SidebarLists selectedId={selectedListId} onSelect={selectList} />}
      center={
        <TasksPanel
          listId={selectedListId}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
          refreshKey={tasksRefreshKey}
        />
      }
      right={
        <TaskDetailsPanel
          taskId={selectedTaskId}
          onDeleted={() => {
            setSelectedTaskId(null);
            setTasksRefreshKey((k) => k + 1);
          }}
        />
      }
    />
  );
}
