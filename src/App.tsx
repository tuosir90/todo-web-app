import * as React from "react"
import { IconCircle, IconCircleCheck } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TodoForm } from "@/components/todo-form"
import { TodoList } from "@/components/todo-list"
import { TodoSidebar } from "@/components/todo-sidebar"
import { useTheme } from "@/components/theme-provider"
import {
  createTodo,
  DEFAULT_CATEGORY_ID,
  getTodoCategoryLabel,
  loadTodos,
  storeTodos,
  type CategoryFilter,
  type Todo,
  type TodoCategoryId,
} from "@/lib/todos"

export function App() {
  const { theme, setTheme } = useTheme()
  const [newTodoCategory, setNewTodoCategory] =
    React.useState<TodoCategoryId>(DEFAULT_CATEGORY_ID)
  const [activeCategory, setActiveCategory] =
    React.useState<CategoryFilter>("all")
  const [todos, setTodos] = React.useState<Todo[]>(loadTodos)

  const isDark = theme === "dark"
  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount
  const visibleTodos =
    activeCategory === "all"
      ? todos
      : todos.filter((todo) => todo.categoryId === activeCategory)
  const activeCategoryLabel =
    activeCategory === "all" ? "全部分类" : getTodoCategoryLabel(activeCategory)

  React.useEffect(() => {
    storeTodos(todos)
  }, [todos])

  function handleCategoryFilterChange(categoryId: CategoryFilter) {
    setActiveCategory(categoryId)
    if (categoryId !== "all") {
      setNewTodoCategory(categoryId)
    }
  }

  function addTodo(text: string, date: string, categoryId: TodoCategoryId) {
    setTodos((currentTodos) => [
      createTodo(text, date, categoryId),
      ...currentTodos,
    ])
  }

  function toggleTodo(id: string, completed: boolean) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    )
  }

  function deleteTodo(id: string) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  return (
    <SidebarProvider>
      <TodoSidebar
        activeCategory={activeCategory}
        activeCount={activeCount}
        completedCount={completedCount}
        isDark={isDark}
        todos={todos}
        onCategoryChange={handleCategoryFilterChange}
        onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
      />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
            <SidebarTrigger />
            <div className="min-w-0">
              <h1 className="text-lg font-medium">待办事项</h1>
              <p className="truncate text-xs text-muted-foreground">
                当前查看 {activeCategoryLabel}，共 {visibleTodos.length} 项
              </p>
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
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
              <TodoForm
                categoryId={newTodoCategory}
                onCategoryChange={setNewTodoCategory}
                onAddTodo={addTodo}
              />
              <TodoList
                activeCategory={activeCategory}
                activeCategoryLabel={activeCategoryLabel}
                todos={visibleTodos}
                onDeleteTodo={deleteTodo}
                onToggleTodo={toggleTodo}
              />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
