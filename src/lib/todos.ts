export const TODO_CATEGORIES = [
  { id: "work", label: "工作" },
  { id: "study", label: "学习" },
  { id: "life", label: "生活" },
  { id: "health", label: "健康" },
  { id: "shopping", label: "购物" },
] as const

export type TodoCategoryId = (typeof TODO_CATEGORIES)[number]["id"]
export type CategoryFilter = "all" | TodoCategoryId

export type Todo = {
  id: string
  text: string
  date: string
  categoryId: TodoCategoryId
  completed: boolean
}

type StoredTodo = Omit<Todo, "date" | "categoryId"> & {
  date?: string
  categoryId?: string
}

export const DEFAULT_CATEGORY_ID: TodoCategoryId = TODO_CATEGORIES[0].id

export const TODO_STORAGE_KEY = "todo-web-app.todos"

export function getTodayDateValue() {
  const today = new Date()
  const offsetDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000
  )

  return offsetDate.toISOString().slice(0, 10)
}

export function formatDateLabel(dateValue: string) {
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

export function isTodoCategoryId(value: string): value is TodoCategoryId {
  return TODO_CATEGORIES.some((category) => category.id === value)
}

export function getTodoCategory(categoryId: TodoCategoryId) {
  return TODO_CATEGORIES.find((category) => category.id === categoryId)
}

export function getTodoCategoryLabel(categoryId: TodoCategoryId) {
  return getTodoCategory(categoryId)?.label ?? categoryId
}

export function groupTodosByDate(todos: Todo[]) {
  const groups = new Map<string, Todo[]>()

  for (const todo of todos) {
    const groupedTodos = groups.get(todo.date) ?? []
    groups.set(todo.date, [...groupedTodos, todo])
  }

  return Array.from(groups.entries()).sort(([leftDate], [rightDate]) =>
    rightDate.localeCompare(leftDate)
  )
}

export function createTodo(
  text: string,
  date: string,
  categoryId: TodoCategoryId
): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    date,
    categoryId,
    completed: false,
  }
}

function getStoredTodos(): string | null {
  try {
    return localStorage.getItem(TODO_STORAGE_KEY)
  } catch (error) {
    console.warn("Todo storage is unavailable.", error)
    return null
  }
}

function storeTodos(todos: Todo[]) {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.warn("Todo storage is unavailable.", error)
  }
}

function isStoredTodo(value: unknown): value is StoredTodo {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const todo = value as Record<string, unknown>
  if (
    typeof todo.id !== "string" ||
    typeof todo.text !== "string" ||
    typeof todo.completed !== "boolean"
  ) {
    return false
  }

  const hasValidDate =
    typeof todo.date === "string" ? /^\d{4}-\d{2}-\d{2}$/.test(todo.date) : true
  const hasValidCategory =
    typeof todo.categoryId === "string"
      ? isTodoCategoryId(todo.categoryId)
      : true

  return hasValidDate && hasValidCategory
}

function normalizeTodo(todo: StoredTodo): Todo {
  const storedCategoryId = todo.categoryId ?? ""
  const categoryId = isTodoCategoryId(storedCategoryId)
    ? storedCategoryId
    : DEFAULT_CATEGORY_ID

  return {
    ...todo,
    date: todo.date || getTodayDateValue(),
    categoryId,
  }
}

export function loadTodos(): Todo[] {
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

export { storeTodos }
