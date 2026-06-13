import { IconCalendar, IconTag, IconTrash } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  formatDateLabel,
  getTodoCategoryLabel,
  groupTodosByDate,
  type CategoryFilter,
  type Todo,
} from "@/lib/todos"

type TodoListProps = {
  activeCategory: CategoryFilter
  activeCategoryLabel: string
  todos: Todo[]
  onDeleteTodo: (id: string) => void
  onToggleTodo: (id: string, completed: boolean) => void
}

export function TodoList({
  activeCategory,
  activeCategoryLabel,
  todos,
  onDeleteTodo,
  onToggleTodo,
}: TodoListProps) {
  const dateGroups = groupTodosByDate(todos)

  if (todos.length === 0) {
    return (
      <div className="border border-dashed border-border bg-muted/35 px-4 py-12 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center border border-border bg-background">
          <IconTag className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">暂无待办事项</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {activeCategory === "all"
            ? "添加第一条待办后会按日期显示在这里。"
            : `当前分类「${activeCategoryLabel}」还没有待办。`}
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-4" aria-label="待办事项列表">
      {dateGroups.map(([date, dateTodos]) => (
        <section key={date} className="space-y-2">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
            <h2 className="flex min-w-0 items-center gap-2 text-sm font-medium">
              <IconCalendar className="size-4 shrink-0" />
              <span className="truncate">{formatDateLabel(date)}</span>
            </h2>
            <Badge variant="outline">{dateTodos.length} 项</Badge>
          </div>
          <ul className="space-y-2">
            {dateTodos.map((todo) => (
              <li
                key={todo.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-border/80 bg-card px-3 py-2.5 shadow-xs"
              >
                <Checkbox
                  checked={todo.completed}
                  aria-label={`标记 ${todo.text} 为完成`}
                  onCheckedChange={(checked) =>
                    onToggleTodo(todo.id, checked === true)
                  }
                />
                <div className="min-w-0">
                  <span
                    className={cn(
                      "block min-w-0 text-sm leading-6 [overflow-wrap:anywhere]",
                      todo.completed &&
                        "text-muted-foreground line-through decoration-2"
                    )}
                  >
                    {todo.text}
                  </span>
                  <Badge variant="secondary" className="mt-1">
                    {getTodoCategoryLabel(todo.categoryId)}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`删除 ${todo.text}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteTodo(todo.id)}
                >
                  <IconTrash />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
