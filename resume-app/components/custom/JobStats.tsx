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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold">{totalJobs}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Remote Jobs</p>
              <p className="text-2xl font-bold">{remotePercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Full-time</p>
              <p className="text-2xl font-bold">{fullTimePercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Salary</p>
              <p className="text-xl font-bold">{avgSalary || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobStats;
