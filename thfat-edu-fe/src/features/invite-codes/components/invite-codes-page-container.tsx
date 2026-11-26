"use client";

import { AdminPageHeader } from "@/components/layout/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { useInviteCodes } from "../hooks/use-invite-codes";
import { CreateInviteCodesDialog } from "./create-invite-codes-dialog";
import { InviteCodesTable } from "./invite-codes-table";

export function InviteCodesPageContainer() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data } = useInviteCodes({ limit: 1 });

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Mã mời"
        badge={
          <Badge variant="secondary" className="text-xs font-normal">
            {data?.total ?? 0} mã
          </Badge>
        }
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="size-3.5" />
            <span>Tạo mã mời</span>
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <InviteCodesTable />
      </div>
      <CreateInviteCodesDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
