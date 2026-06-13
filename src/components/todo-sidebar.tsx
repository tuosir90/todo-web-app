import {
  IconBook,
  IconBriefcase,
  IconFilter,
  IconHeartbeat,
  IconHome,
  IconList,
  IconMoon,
  IconShoppingCart,
  IconSun,
} from "@tabler/icons-react"
import type * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  TODO_CATEGORIES,
  type CategoryFilter,
  type Todo,
  type TodoCategoryId,
} from "@/lib/todos"

type TodoSidebarProps = {
  activeCategory: CategoryFilter
  activeCount: number
  completedCount: number
  isDark: boolean
  todos: Todo[]
  onCategoryChange: (categoryId: CategoryFilter) => void
  onToggleTheme: () => void
}

const categoryIcons: Record<TodoCategoryId, React.ElementType> = {
  work: IconBriefcase,
  study: IconBook,
  life: IconHome,
  health: IconHeartbeat,
  shopping: IconShoppingCart,
}

export function TodoSidebar({
  activeCategory,
  activeCount,
  completedCount,
  isDark,
  todos,
  onCategoryChange,
  onToggleTheme,
}: TodoSidebarProps) {
  const categoryCounts = TODO_CATEGORIES.reduce(
    (counts, category) => ({
      ...counts,
      [category.id]: todos.filter((todo) => todo.categoryId === category.id)
        .length,
    }),
    {} as Record<TodoCategoryId, number>
  )

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconList className="size-4" />
            <span>待办工作台</span>
          </div>
          <p className="text-xs text-sidebar-foreground/70">
            按分类筛选，按日期执行。
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <IconFilter className="size-4" />
            分类
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeCategory === "all"}
                  tooltip="全部分类"
                  onClick={() => onCategoryChange("all")}
                >
                  <IconList />
                  <span>全部分类</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{todos.length}</SidebarMenuBadge>
              </SidebarMenuItem>
              {TODO_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category.id]

                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      isActive={activeCategory === category.id}
                      tooltip={category.label}
                      onClick={() => onCategoryChange(category.id)}
                    >
                      <Icon />
                      <span>{category.label}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>
                      {categoryCounts[category.id]}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>概览</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2 px-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sidebar-foreground/70">待处理</span>
              <span className="font-medium">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-sidebar-foreground/70">已完成</span>
              <span className="font-medium">{completedCount}</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={onToggleTheme}
        >
          {isDark ? <IconSun /> : <IconMoon />}
          {isDark ? "浅色模式" : "深色模式"}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
