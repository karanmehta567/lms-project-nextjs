import { GetDashStats } from "@/app/data/user/admin-get-dashboard-stat"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookAIcon, BookIcon, Users2Icon, UsersIcon } from "lucide-react"

export async function SectionCards() {
  const {totalCourses,totalCustomers,totalLessons,totalSignUps}=await GetDashStats()
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="">
          <CardDescription>Total Signups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSignUps}
          </CardTitle>
          </div>
          <UsersIcon className="size-6 text-muted-foreground"/>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Registered Users on this platform</p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers}
          </CardTitle>
          </div>
          <Users2Icon className="size-6 text-muted-foreground"/>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Users who have enrolled in the courses
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
        </CardHeader>
        <BookIcon className="size-6 text-muted-foreground"/>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Available Courses
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Total Lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLessons}
          </CardTitle>
        </CardHeader>
        <BookAIcon className="size-6 text-muted-foreground"/>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Total learning content
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
