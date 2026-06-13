import * as React from "react"
import {
  RiAddLine,
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
  completed: boolean
}

const TODOS_STORAGE_KEY = "todo-web-app.todos"

function createTodo(text: string): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
  }
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const todo = value as Record<string, unknown>
  return (
    typeof todo.id === "string" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean"
  )
}

function loadTodos(): Todo[] {
  const savedTodos = localStorage.getItem(TODOS_STORAGE_KEY)
  if (!savedTodos) {
    return []
  }

  try {
    const parsedTodos = JSON.parse(savedTodos)
    return Array.isArray(parsedTodos) ? parsedTodos.filter(isTodo) : []
  } catch {
    return []
  }
}

export function App() {
  const { theme, setTheme } = useTheme()
  const [inputValue, setInputValue] = React.useState("")
  const [todos, setTodos] = React.useState<Todo[]>(loadTodos)

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount
  const isDark = theme === "dark"

  React.useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = inputValue.trim()
    if (!text) {
      return
    }

    setTodos((currentTodos) => [createTodo(text), ...currentTodos])
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
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-emerald-100 via-background to-sky-100 px-4 py-8 text-foreground dark:from-emerald-950/35 dark:via-background dark:to-sky-950/30 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="rounded-lg border-border/80 shadow-sm">
          <CardHeader className="gap-3">
            <div>
              <CardTitle className="text-2xl">待办事项</CardTitle>
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
            <form className="flex gap-2 sm:gap-3" onSubmit={handleSubmit}>
              <Input
                className="h-10"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="输入新的待办事项"
                aria-label="新的待办事项"
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
              <div className="rounded-lg border border-dashed border-border bg-muted/35 px-4 py-10 text-center text-sm text-muted-foreground">
                暂无待办事项
              </div>
            ) : (
              <ul className="space-y-2" aria-label="待办事项列表">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border/80 bg-card px-3 py-2.5 shadow-xs"
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
                        "min-w-0 [overflow-wrap:anywhere] text-sm leading-6",
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
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default App
