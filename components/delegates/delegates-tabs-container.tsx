"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, Bell } from "lucide-react";
import { DelegateManagement } from "./delegate-management";
import { EmailComposer } from "./email-composer";
import { PushNotificationCenter } from "./push-notification-center";
import type { Delegate } from "@/types/delegate";

interface DelegatesTabsContainerProps {
  delegates: Delegate[];
  currentYear: number;
  eventYears: number[];
  currentPage: number;
  totalPages: number;
  totalDelegates: number;
  countries: string[];
  delegateTypes: string[];
  initialFilters: {
    search: string;
    country: string;
    status: string;
    type: string;
    mode: string;
  };
}

export function DelegatesTabsContainer({
  delegates,
  currentYear,
  eventYears,
  currentPage,
  totalPages,
  totalDelegates,
  countries,
  delegateTypes,
  initialFilters,
}: DelegatesTabsContainerProps) {
  const [selectedDelegates, setSelectedDelegates] = useState<Delegate[]>([]);

  return (
    <Tabs defaultValue="delegates" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 shadow-lg rounded-xl p-1 h-14 bg-card border">
        <TabsTrigger
          value="delegates"
          className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg h-12 text-sm font-bold transition-all duration-200"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Delegate Management</span>
          <span className="sm:hidden">Delegates</span>
        </TabsTrigger>
        <TabsTrigger
          value="email"
          className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg h-12 text-sm font-bold transition-all duration-200"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Email Composition</span>
          <span className="sm:hidden">Email</span>
        </TabsTrigger>
        <TabsTrigger
          value="push"
          className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg h-12 text-sm font-bold transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Push Notifications</span>
          <span className="sm:hidden">Push</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="delegates" className="space-y-6">
        <DelegateManagement
          delegates={delegates}
          selectedDelegates={selectedDelegates}
          onSelectionChange={setSelectedDelegates}
          currentYear={currentYear}
          eventYears={eventYears}
          currentPage={currentPage}
          totalPages={totalPages}
          totalDelegates={totalDelegates}
          countries={countries}
          delegateTypes={delegateTypes}
          initialFilters={initialFilters}
        />
      </TabsContent>

      <TabsContent value="email" className="space-y-6">
        <EmailComposer selectedDelegates={selectedDelegates} />
      </TabsContent>

      <TabsContent value="push" className="space-y-6">
        <PushNotificationCenter selectedDelegates={selectedDelegates} />
      </TabsContent>
    </Tabs>
  );
}
