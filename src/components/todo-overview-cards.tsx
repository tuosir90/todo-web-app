import {
  IconCalendarDue,
  IconCircleCheck,
  IconClockHour4,
  IconProgressCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { isDateBeforeToday, isDateToday, type Todo } from "@/lib/todos"

type TodoOverviewCardsProps = {
  todos: Todo[]
}

export function TodoOverviewCards({ todos }: TodoOverviewCardsProps) {
  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)
  const todayTodos = todos.filter((todo) => isDateToday(todo.date))
  const overdueTodos = activeTodos.filter((todo) =>
    isDateBeforeToday(todo.date)
  )
  const completionRate =
    todos.length === 0
      ? 0
      : Math.round((completedTodos.length / todos.length) * 100)
  const cards = [
    {
      title: "待处理",
      value: activeTodos.length,
      description: "仍需推进的事项",
      detail: "用于衡量当前负载",
      icon: IconClockHour4,
      badge: `${activeTodos.length} 项`,
    },
    {
      title: "今日事项",
      value: todayTodos.length,
      description: "计划今天完成",
      detail: todayTodos.length === 0 ? "今天暂无安排" : "优先检查今天列表",
      icon: IconCalendarDue,
      badge: "Today",
    },
    {
      title: "已完成",
      value: completedTodos.length,
      description: "已勾选完成",
      detail: `完成率 ${completionRate}%`,
      icon: IconCircleCheck,
      badge: `${completionRate}%`,
    },
    {
      title: "逾期未完",
      value: overdueTodos.length,
      description: "日期早于今天",
      detail: overdueTodos.length === 0 ? "没有逾期压力" : "建议优先处理",
      icon: IconProgressCheck,
      badge: overdueTodos.length === 0 ? "Clear" : "Review",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.title} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Icon />
                  {card.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.description}
                <Icon className="size-4" />
              </div>
              <div className="text-muted-foreground">{card.detail}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
