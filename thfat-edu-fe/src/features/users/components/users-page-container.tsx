"use client";

import { useState } from "react";

import { useUsers } from "../hooks/use-users";
import { UsersPageHero } from "./users-page-hero";
import { UsersTable } from "./users-table";

export function UsersPageContainer() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data } = useUsers({ limit: 1 });

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 lg:px-8 lg:py-6">
      <UsersPageHero
        totalUsers={data?.total ?? 0}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />
      <UsersTable isCreateOpen={isCreateOpen} onCloseCreate={() => setIsCreateOpen(false)} />
    </div>
  );
}
