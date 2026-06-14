import {
  IconCircle,
  IconCircleCheck,
  IconLayoutDashboard,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

type TodoSiteHeaderProps = {
  activeCategoryLabel: string
  activeCount: number
  completedCount: number
  visibleCount: number
}

export function TodoSiteHeader({
  activeCategoryLabel,
  activeCount,
  completedCount,
  visibleCount,
}: TodoSiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/90 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex min-w-0 items-center gap-2">
          <IconLayoutDashboard className="hidden size-4 text-muted-foreground sm:block" />
          <div className="min-w-0">
            <h1 className="truncate text-base font-medium">待办工作台</h1>
            <p className="truncate text-xs text-muted-foreground">
              {activeCategoryLabel} · {visibleCount} 项
            </p>
          </div>
        </div>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Badge variant="secondary">
            <IconCircle />
            待处理 {activeCount}
          </Badge>
          <Badge variant="outline">
            <IconCircleCheck />
            已完成 {completedCount}
          </Badge>
        </div>
      </div>
    </header>
  )
}
