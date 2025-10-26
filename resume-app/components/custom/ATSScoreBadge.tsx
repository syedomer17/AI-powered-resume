"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ATSScoreBadgeProps {
  score: number;
  className?: string;
}

const ATSScoreBadge = ({ score, className = "" }: ATSScoreBadgeProps) => {
  const getScoreColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getScoreIcon = () => {
    if (score >= 80) return <TrendingUp className="w-4 h-4" />;
    if (score >= 60) return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${getScoreColor()} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold`}>
        {getScoreIcon()}
        <span>ATS: {score}/100</span>
      </div>
      <Badge variant="outline">{getScoreLabel()}</Badge>
    </div>
  );
};

export default ATSScoreBadge;
