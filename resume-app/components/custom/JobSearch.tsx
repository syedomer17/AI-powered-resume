"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Search, MapPin, Building2, ExternalLink, Calendar, DollarSign, Briefcase, Mail, Zap, CheckSquare } from "lucide-react";
import axios from "axios";
import JobStats from "./JobStats";
import SendToHR from "./SendToHR";
import AutoApply from "./AutoApply";

interface Job {
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_description: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_posted_at_datetime_utc?: string;
  job_is_remote: boolean;
  job_salary?: string;
  job_min_salary?: number;
  job_max_salary?: number;
}

interface JobSearchProps {
  userSkills?: string[];
  defaultQuery?: string;
  resumeId?: string; // Add resume ID for sending to HR and auto-apply
}

const JobSearch = ({ userSkills = [], defaultQuery = "", resumeId }: JobSearchProps) => {
  const [query, setQuery] = useState(defaultQuery);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [employmentType, setEmploymentType] = useState<string>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [datePosted, setDatePosted] = useState<string>("all");
  const [hasSearched, setHasSearched] = useState(false);
  
  // Send to HR and Auto Apply states
  const [showSendToHR, setShowSendToHR] = useState(false);
  const [showAutoApply, setShowAutoApply] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Auto-generate query from skills
  useEffect(() => {
    if (!defaultQuery && userSkills.length > 0) {
      const skillsQuery = userSkills.slice(0, 3).join(" ");
      setQuery(skillsQuery);
    }
  }, [userSkills, defaultQuery]);

  const handleSearch = async (resetPage = true) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      if (resetPage) setPage(1);

      const params: any = {
        query: query.trim(),
        page: resetPage ? 1 : page,
        date_posted: datePosted,
      };

      if (employmentType !== "all") {
        params.employment_types = employmentType;
      }

      if (remoteOnly) {
        params.remote_jobs_only = true;
      }

      console.log("Searching with params:", params);

      const response = await axios.post("/api/jobs/search", params);
      
      console.log("Search response:", response.data);
      
      setJobs(response.data.data);
      setHasSearched(true);
    } catch (err: any) {
      console.error("Failed to search jobs:", err);
      console.error("Error response:", err.response?.data);
      
      // Show more detailed error message
      const errorMessage = err.response?.data?.error || "Failed to search jobs. Please try again.";
      const errorDetails = err.response?.data?.details || "";
      const errorHint = err.response?.data?.hint || "";
      
      let fullMessage = errorMessage;
      if (errorDetails) fullMessage += `\n\nDetails: ${errorDetails}`;
      if (errorHint) fullMessage += `\n\n${errorHint}`;
      
      alert(fullMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    const types: { [key: string]: string } = {
      FULLTIME: "bg-green-100 text-green-800",
      PARTTIME: "bg-blue-100 text-blue-800",
      CONTRACTOR: "bg-purple-100 text-purple-800",
      INTERN: "bg-orange-100 text-orange-800",
    };
    return types[type] || "bg-gray-100 text-gray-800";
  };

  const formatPostedDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  // Job selection handlers
  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };
  
  const selectAllJobs = () => {
    setSelectedJobs(jobs.map(job => job.job_id));
  };
  
  const clearSelection = () => {
    setSelectedJobs([]);
  };
  
  const getSelectedJobsData = () => {
    return jobs.filter(job => selectedJobs.includes(job.job_id));
  };

  // Calculate statistics
  const jobStats = {
    totalJobs: jobs.length,
    remoteJobs: jobs.filter(j => j.job_is_remote).length,
    fullTimeJobs: jobs.filter(j => j.job_employment_type === "FULLTIME").length,
    avgSalary: jobs.find(j => j.job_salary)?.job_salary,
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Find Your Next Opportunity
          </CardTitle>
          <CardDescription className="text-sm">
            Search for jobs matching your skills and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skills Suggestions */}
          {userSkills.length > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Your skills - Click to search:
              </p>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 8).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => setQuery(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search for jobs (e.g., React Developer, Full Stack Engineer)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-12 text-base"
            />
            <Button 
              onClick={() => handleSearch()} 
              disabled={loading || !query.trim()}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </>
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Employment Type</label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FULLTIME">Full-time</SelectItem>
                  <SelectItem value="PARTTIME">Part-time</SelectItem>
                  <SelectItem value="CONTRACTOR">Contract</SelectItem>
                  <SelectItem value="INTERN">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Date Posted</label>
              <Select value={datePosted} onValueChange={setDatePosted}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Date Posted" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="3days">Last 3 Days</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Location Type</label>
              <div className="flex items-center h-10 px-4 rounded-lg border border-input bg-background hover:bg-accent transition-colors">
                <input
                  type="checkbox"
                  id="remote"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-blue-400 cursor-pointer"
                />
                <label htmlFor="remote" className="ml-2 text-sm font-medium cursor-pointer flex-1">
                  Remote Only
                </label>
                {remoteOnly && (
                  <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin w-12 h-12 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-muted-foreground font-medium">Searching for opportunities...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && hasSearched && jobs.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                <Search className="relative w-16 h-16 text-muted-foreground/50 mx-auto" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We couldn't find any jobs matching your criteria. Try adjusting your search terms or filters.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <Button variant="outline" onClick={() => setQuery("")}>
                  Clear Search
                </Button>
                <Button variant="outline" onClick={() => setEmploymentType("all")}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {/* Statistics */}
          <JobStats
            totalJobs={jobStats.totalJobs}
            remoteJobs={jobStats.remoteJobs}
            fullTimeJobs={jobStats.fullTimeJobs}
            avgSalary={jobStats.avgSalary}
          />

          {/* Action Buttons - Send to HR & Auto Apply */}
          {resumeId && (
            <Card className="relative overflow-hidden border-2 border-purple-500/20 dark:border-purple-400/20">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-blue-500/20 dark:to-purple-500/20" />
              <CardContent className="p-4 sm:p-6 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-purple-500/20">
                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      AI-Powered Actions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedJobs.length > 0 
                        ? `${selectedJobs.length} job${selectedJobs.length > 1 ? 's' : ''} selected for actions`
                        : 'Select jobs below or use bulk actions'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobs.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                          className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          Clear ({selectedJobs.length})
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          size="sm"
                          onClick={() => setShowAutoApply(true)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Auto Apply ({selectedJobs.length})
                        </Button>
                      </>
                    )}
                    {selectedJobs.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllJobs}
                        className="border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Select All
                      </Button>
                    )}
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      size="sm"
                      onClick={() => setShowSendToHR(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send to HR
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Listings */}

          {jobs.map((job) => (
            <Card 
              key={job.job_id} 
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                selectedJobs.includes(job.job_id) 
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-500/5 dark:bg-blue-500/10' 
                  : 'border hover:border-blue-500/50'
              }`}
            >
              {selectedJobs.includes(job.job_id) && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                  {/* Selection Checkbox */}
                  {resumeId && (
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.job_id)}
                        onChange={() => toggleJobSelection(job.job_id)}
                        className="w-5 h-5 cursor-pointer accent-blue-600 dark:accent-blue-400 rounded"
                      />
                    </div>
                  )}
                  
                  {/* Company Logo */}
                  {job.employer_logo && (
                    <div className="shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-border bg-background p-2 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                        <img
                          src={job.employer_logo}
                          alt={job.employer_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.job_title}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span className="font-medium truncate">{job.employer_name}</span>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      {(job.job_city || job.job_state || job.job_country) && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 shrink-0 text-blue-500" />
                          <span className="truncate">
                            {[job.job_city, job.job_state, job.job_country]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span>{formatPostedDate(job.job_posted_at_datetime_utc)}</span>
                      </div>
                      {job.job_salary && (
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 shrink-0 text-amber-500" />
                          <span className="font-semibold">{job.job_salary}</span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getEmploymentTypeColor(job.job_employment_type)} border-0`}>
                        {job.job_employment_type}
                      </Badge>
                      {job.job_is_remote && (
                        <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Remote
                        </Badge>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {job.job_description}
                    </p>

                    {/* Apply Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => window.open(job.job_apply_link, "_blank")}
                        size="sm"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      {job.employer_website && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(job.employer_website, "_blank")}
                          size="sm"
                          className="hover:bg-accent"
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Company Site
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Send to HR Dialog */}
      {resumeId && (
        <Dialog open={showSendToHR} onOpenChange={setShowSendToHR}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Resume to HR Contacts</DialogTitle>
            </DialogHeader>
            <SendToHR 
              resumeId={resumeId} 
              onClose={() => setShowSendToHR(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Auto Apply Dialog */}
      {resumeId && selectedJobs.length > 0 && (
        <Dialog open={showAutoApply} onOpenChange={setShowAutoApply}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Auto Apply to Selected Jobs</DialogTitle>
            </DialogHeader>
            <AutoApply 
              jobs={getSelectedJobsData()}
              resumeId={resumeId}
              onClose={() => {
                setShowAutoApply(false);
                clearSelection();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default JobSearch;
