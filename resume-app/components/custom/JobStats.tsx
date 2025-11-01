"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";

interface JobStatsProps {
  totalJobs: number;
  remoteJobs: number;
  fullTimeJobs: number;
  avgSalary?: string;
}

const JobStats = ({ totalJobs, remoteJobs, fullTimeJobs, avgSalary }: JobStatsProps) => {
  const remotePercentage = totalJobs > 0 ? Math.round((remoteJobs / totalJobs) * 100) : 0;
  const fullTimePercentage = totalJobs > 0 ? Math.round((fullTimeJobs / totalJobs) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalJobs}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remote Jobs</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{remotePercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full-time</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fullTimePercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 dark:bg-amber-500/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Salary</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{avgSalary || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobStats;
