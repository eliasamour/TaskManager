import { useState } from "react";
import AppShell from "../components/AppShell";
import SidebarLists from "../components/SidebarLists";
import TasksPanel from "../components/TasksPanel";
import TaskDetailsPanel from "../components/TaskDetailsPanel";
import logo from "../assets/logo-saegus.png";

export default function AppPage() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);

  function selectList(id: string) {
    setSelectedListId(id ? id : null);
    setSelectedTaskId(null);
    setRightOpen(false); // logique: pas de task sélectionnée => détails fermés
    setTasksRefreshKey((k) => k + 1);
  }

  function selectTask(id: string | null) {
    setSelectedTaskId(id);
    setRightOpen(!!id);
  }

  function onCenterMouseDown(e: React.MouseEvent) {
    const el = e.target as HTMLElement;
    const clickedOnTaskRow = !!el.closest('[data-task-row="true"]');

    // règle demandée: si clic ailleurs que sur une task => fermer sidebar droite
    if (!clickedOnTaskRow) {
      setSelectedTaskId(null);
      setRightOpen(false);
    }
  }

  return (
    <AppShell
      leftOpen={leftOpen}
      rightOpen={rightOpen}
      onToggleLeft={() => setLeftOpen((v) => !v)}
      onToggleRight={() => setRightOpen((v) => !v)}
      left={
        <SidebarLists
          selectedId={selectedListId}
          onSelect={selectList}
        />
      }
      center={
        <div onMouseDown={onCenterMouseDown}>
          <TasksPanel
            listId={selectedListId}
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            refreshKey={tasksRefreshKey}
          />
        </div>
      }
      right={
        <TaskDetailsPanel
          taskId={selectedTaskId}
          onDeleted={() => {
            setSelectedTaskId(null);
            setRightOpen(false);
            setTasksRefreshKey((k) => k + 1);
          }}
        />
      }
      logoSrc={logo}
    />
  );
}
