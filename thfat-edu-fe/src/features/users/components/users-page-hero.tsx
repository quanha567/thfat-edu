import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

export type TUsersPageHeroProps = {
  totalUsers?: number;
  onOpenCreateModal: () => void;
};

export function UsersPageHero({ totalUsers = 0, onOpenCreateModal }: TUsersPageHeroProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Users className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
            Quản lý người dùng
          </h1>
          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {totalUsers} người dùng
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Xem, cấp phát, phân quyền và quản lý tài khoản học sinh, giáo viên và quản trị viên.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onOpenCreateModal} className="h-9 gap-1.5 shadow-xs">
          <UserPlus className="h-4 w-4" />
          <span>Thêm người dùng</span>
        </Button>
      </div>
    </div>
  );
}
