import { useState } from "react";
import AppShell from "../components/AppShell";
import SidebarLists from "../components/SidebarLists";

export default function AppPage() {
    const [selectedListId, setSelectedListId] = useState<string | null>(null);

    function selectList(id: string) {
        setSelectedListId(id ? id : null);
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
        <div className="p-8 text-slate-300">
          {selectedListId
            ? `Selected list: ${selectedListId}`
            : "Select a list"}
        </div>
      }
      right={<div className="p-8 text-slate-500">No task selected</div>}
    />
  );
}
