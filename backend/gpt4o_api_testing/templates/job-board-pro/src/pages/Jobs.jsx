import React, { useEffect, useState } from "react";
import useJobStore from "../store/useJobStore";
import JobCard from "../components/JobCard";
import JobFilter from "../components/JobFilter";
import Pagination from "../components/Pagination";

const Jobs = () => {
  const { 
    jobs, 
    loadJobs, 
    filteredJobs, 
    applyFilter, 
    categories 
  } = useJobStore();

  const [filter, setFilter] = useState({
    q: "",
    category: "",
    type: "",
    location: ""
  });

  const [page, setPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilter(filter);
    setPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const start = (page - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(start, start + jobsPerPage);

  return (
    <div>
<h1 className="text-4xl font-extrabold text-white mb-6">
  Browse <span className="text-accent-blue">Jobs</span>
</h1>


      <JobFilter filter={filter} setFilter={setFilter} categories={categories} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Jobs;
