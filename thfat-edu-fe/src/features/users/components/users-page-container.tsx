"use client";

import { AdminPageHeader } from "@/components/layout/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

import { useUsers } from "../hooks/use-users";
import { UsersTable } from "./users-table";

export function UsersPageContainer() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data } = useUsers({ limit: 1 });

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Người dùng"
        badge={
          <Badge variant="secondary" className="text-xs font-normal">
            {data?.total ?? 0} người dùng
          </Badge>
        }
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <UserPlus className="size-3.5" />
            <span>Thêm người dùng</span>
          </Button>
        }
      />
      <UsersTable isCreateOpen={isCreateOpen} onCloseCreate={() => setIsCreateOpen(false)} />
    </div>
  );
}
