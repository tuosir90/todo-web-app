import * as React from "react"
import {
  RiAddLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiCircleLine,
  RiDeleteBinLine,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type Todo = {
  id: string
  text: string
  date: string
  completed: boolean
}

type StoredTodo = Omit<Todo, "date"> & {
  date?: string
}

const TODOS_STORAGE_KEY = "todo-web-app.todos"

function getStoredTodos(): string | null {
  try {
    return localStorage.getItem(TODOS_STORAGE_KEY)
  } catch (error) {
    console.warn("Todo storage is unavailable.", error)
    return null
  }
}

function storeTodos(todos: Todo[]) {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.warn("Todo storage is unavailable.", error)
  }
}

function getTodayDateValue() {
  const today = new Date()
  const offsetDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000
  )

  return offsetDate.toISOString().slice(0, 10)
}

function formatDateLabel(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number)
  if (!year || !month || !day) {
    return dateValue
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(year, month - 1, day))
}

function createTodo(text: string, date: string): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    date,
    completed: false,
  }
}

function isStoredTodo(value: unknown): value is StoredTodo {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const todo = value as Record<string, unknown>
  if (
    typeof todo.id === "string" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean"
  ) {
    return typeof todo.date === "string"
      ? /^\d{4}-\d{2}-\d{2}$/.test(todo.date)
      : true
  }

  return false
}

function normalizeTodo(todo: StoredTodo): Todo {
  return {
    ...todo,
    date: todo.date || getTodayDateValue(),
  }
}

function loadTodos(): Todo[] {
  const savedTodos = getStoredTodos()
  if (!savedTodos) {
    return []
  }

  try {
    const parsedTodos = JSON.parse(savedTodos)
    return Array.isArray(parsedTodos)
      ? parsedTodos.filter(isStoredTodo).map(normalizeTodo)
      : []
  } catch {
    return []
  }
}

export function App() {
  const { theme, setTheme } = useTheme()
  const [inputValue, setInputValue] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState(getTodayDateValue)
  const [todos, setTodos] = React.useState<Todo[]>(loadTodos)

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount
  const isDark = theme === "dark"
  const todosByDate = React.useMemo(() => {
    const groups = new Map<string, Todo[]>()

    for (const todo of todos) {
      const groupedTodos = groups.get(todo.date) ?? []
      groups.set(todo.date, [...groupedTodos, todo])
    }

    return Array.from(groups.entries()).sort(([leftDate], [rightDate]) =>
      leftDate.localeCompare(rightDate)
    )
  }, [todos])

  React.useEffect(() => {
    storeTodos(todos)
  }, [todos])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = inputValue.trim()
    if (!text) {
      return
    }

    setTodos((currentTodos) => [
      createTodo(text, selectedDate),
      ...currentTodos,
    ])
    setInputValue("")
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
    <main className="min-h-svh bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="gap-3">
            <div>
              <CardTitle className="text-lg">待办事项</CardTitle>
              <CardDescription>
                共 {todos.length} 项，已完成 {completedCount} 项，待处理{" "}
                {activeCount} 项
              </CardDescription>
            </div>
            <CardAction>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label={isDark ? "切换到浅色主题" : "切换到深色主题"}
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? <RiSunLine /> : <RiMoonLine />}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="grid gap-2 sm:grid-cols-[1fr_11rem_auto] sm:gap-3"
              onSubmit={handleSubmit}
            >
              <Input
                className="h-10"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="输入新的待办事项"
                aria-label="新的待办事项"
              />
              <Input
                className="h-10"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                aria-label="待办日期"
                required
              />
              <Button className="h-10 px-4" type="submit">
                <RiAddLine />
                添加
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <RiCircleLine />
                待处理 {activeCount}
              </Badge>
              <Badge variant="outline">
                <RiCheckboxCircleLine />
                已完成 {completedCount}
              </Badge>
            </div>

            <Separator />

            {todos.length === 0 ? (
              <div className="border border-dashed border-border bg-muted/35 px-4 py-10 text-center text-sm text-muted-foreground">
                暂无待办事项
              </div>
            ) : (
              <div className="space-y-4" aria-label="按日期分组的待办事项">
                {todosByDate.map(([date, dateTodos]) => (
                  <section key={date} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
                      <h2 className="flex min-w-0 items-center gap-2 text-sm font-medium">
                        <RiCalendarLine className="size-4 shrink-0" />
                        <span className="truncate">
                          {formatDateLabel(date)}
                        </span>
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
                              toggleTodo(todo.id, checked === true)
                            }
                          />
                          <span
                            className={cn(
                              "min-w-0 text-sm leading-6 [overflow-wrap:anywhere]",
                              todo.completed &&
                                "text-muted-foreground line-through decoration-2"
                            )}
                          >
                            {todo.text}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`删除 ${todo.text}`}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <RiDeleteBinLine />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default App
