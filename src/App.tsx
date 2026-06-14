import * as React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TodoForm } from "@/components/todo-form"
import { TodoList } from "@/components/todo-list"
import { TodoOverviewCards } from "@/components/todo-overview-cards"
import { TodoSidebar } from "@/components/todo-sidebar"
import { TodoSiteHeader } from "@/components/todo-site-header"
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
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
          <TodoSiteHeader
            activeCategoryLabel={activeCategoryLabel}
            activeCount={activeCount}
            completedCount={completedCount}
            visibleCount={visibleTodos.length}
          />
          <main className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <TodoOverviewCards todos={todos} />
              <div className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_1fr]">
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
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
