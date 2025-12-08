"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RaffleFiltersProps {
  activeTab: "all" | "free" | "paid"
  onTabChange: (tab: "all" | "free" | "paid") => void
  activeStatus: "all" | "open" | "closed" | "finished"
  onStatusChange: (status: "all" | "open" | "closed" | "finished") => void
}

export function RaffleFilters({
  activeTab,
  onTabChange,
  activeStatus,
  onStatusChange,
}: RaffleFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Type Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Status Filter */}
      <Select value={activeStatus} onValueChange={(v) => onStatusChange(v as any)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="finished">Finished</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
