import * as React from "react"
import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getTodayDateValue,
  TODO_CATEGORIES,
  type TodoCategoryId,
} from "@/lib/todos"

type TodoFormProps = {
  categoryId: TodoCategoryId
  onCategoryChange: (categoryId: TodoCategoryId) => void
  onAddTodo: (text: string, date: string, categoryId: TodoCategoryId) => void
}

export function TodoForm({
  categoryId,
  onCategoryChange,
  onAddTodo,
}: TodoFormProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState(getTodayDateValue)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = inputValue.trim()
    if (!text) {
      return
    }

    onAddTodo(text, selectedDate, categoryId)
    setInputValue("")
  }

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle>快速捕获</CardTitle>
        <CardDescription>
          记录事项、日期和分类，之后在右侧按日期推进。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          id="todo-create-form"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <Label htmlFor="todo-text">事项</Label>
            <Input
              id="todo-text"
              className="h-10"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="输入新的待办事项"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="todo-date">日期</Label>
            <Input
              id="todo-date"
              className="h-10"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>分类</Label>
            <Select
              value={categoryId}
              onValueChange={(value) =>
                onCategoryChange(value as TodoCategoryId)
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {TODO_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="h-10 w-full" form="todo-create-form" type="submit">
          <IconPlus />
          添加到计划
        </Button>
      </CardFooter>
    </Card>
  )
}
