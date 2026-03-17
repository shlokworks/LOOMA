import React, { useEffect } from "react";
import useJobStore from "../store/useJobStore";
import JobCard from "../components/JobCard";

const Home = () => {
  const { jobs, loadJobs, categories } = useJobStore();

  useEffect(() => {
    loadJobs();
  }, []);

  const featured = jobs.slice(0, 6);

  return (
    <div className="text-gray-900">

     <h1 className="text-4xl font-extrabold text-white mb-6">
  Find Your <span className="text-accent-blue">Next Job</span>
</h1>


      {/* Categories */}
<h2 className="text-xl font-semibold mb-3 text-white">Browse Categories</h2>


      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((c, idx) => (
          <span
            key={idx}
            className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm 
                       text-sm font-medium hover:shadow-md transition"
          >
            {c}
          </span>
        ))}
      </div>

      {/* Featured Jobs */}
<h2 className="text-xl font-semibold mb-4 text-white">Featured Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

    </div>
  );
};

export default Home;
