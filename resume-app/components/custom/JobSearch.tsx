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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Jobs
          </CardTitle>
          <CardDescription>
            Search for jobs matching your skills and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skills Suggestions */}
          {userSkills.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Your skills:</p>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 8).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setQuery(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search for jobs (e.g., React Developer, Full Stack Engineer)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={() => handleSearch()} disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger>
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

            <Select value={datePosted} onValueChange={setDatePosted}>
              <SelectTrigger>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remote"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="remote" className="text-sm font-medium cursor-pointer">
                Remote Only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      )}

      {!loading && hasSearched && jobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p>
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
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Actions</h3>
                    <p className="text-sm text-gray-600">
                      {selectedJobs.length > 0 
                        ? `${selectedJobs.length} jobs selected`
                        : 'Select jobs or use bulk actions'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedJobs.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                        >
                          Clear ({selectedJobs.length})
                        </Button>
                        <Button
                          className="bg-yellow-500 hover:bg-yellow-600"
                          size="sm"
                          onClick={() => setShowAutoApply(true)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Auto Apply
                        </Button>
                      </>
                    )}
                    {selectedJobs.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllJobs}
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Select All
                      </Button>
                    )}
                    <Button
                      className="bg-[#9f5bff] hover:bg-[#8a4ee6]"
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
            <Card key={job.job_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Selection Checkbox */}
                  {resumeId && (
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.job_id)}
                        onChange={() => toggleJobSelection(job.job_id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  )}
                  
                  {/* Company Logo */}
                  {job.employer_logo && (
                    <div className="flex-shrink-0">
                      <img
                        src={job.employer_logo}
                        alt={job.employer_name}
                        className="w-16 h-16 object-contain rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.job_title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{job.employer_name}</span>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {(job.job_city || job.job_state || job.job_country) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {[job.job_city, job.job_state, job.job_country]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatPostedDate(job.job_posted_at_datetime_utc)}</span>
                      </div>
                      {job.job_salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.job_salary}</span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getEmploymentTypeColor(job.job_employment_type)}>
                        {job.job_employment_type}
                      </Badge>
                      {job.job_is_remote && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Remote
                        </Badge>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {job.job_description}
                    </p>

                    {/* Apply Button */}
                    <div className="flex gap-2">
                      <Button
                        className="bg-[#9f5bff]"
                        onClick={() => window.open(job.job_apply_link, "_blank")}
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      {job.employer_website && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(job.employer_website, "_blank")}
                        >
                          Company Website
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
