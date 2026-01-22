import { useState } from "react";
import AppShell from "../components/AppShell";
import SidebarLists from "../components/SidebarLists";
import TasksPanel from "../components/TasksPanel";

export default function AppPage() {
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    function selectList(id: string) {
        setSelectedListId(id ? id : null);
    // quand on change de liste, on déselectionne la task
    setSelectedTaskId(null);
    }

  return (
    <AppShell
      left={
        <SidebarLists
          selectedId={selectedListId}
          onSelect={selectList}
        />
      }
      center={
        <TasksPanel
          listId={selectedListId}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
        />
      }
      right={<div className="p-8 text-slate-500">No task selected</div>}
    />
  );
}
