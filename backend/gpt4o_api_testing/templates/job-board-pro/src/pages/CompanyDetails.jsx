import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useJobStore from "../store/useJobStore";
import companyService from "../services/companyService";
import JobCard from "../components/JobCard";

const CompanyDetails = () => {
  const { id } = useParams();
  const { jobs, loadJobs } = useJobStore();

  useEffect(() => {
    loadJobs();
  }, []);

  const company = companyService.getById(id);
  const openJobs = jobs.filter((j) => j.companyId === id);

  if (!company) return <p>Company not found.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="bg-white p-6 rounded shadow mb-6">
        <img 
          src={company.logo} 
          className="w-20 h-20 rounded mb-4"
        />
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-gray-500">{company.industry}</p>
        <p className="text-gray-600 mt-2">{company.description}</p>
        <p className="mt-3">📍 {company.location}</p>
        <p>👥 {company.size}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {openJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

    </div>
  );
};

export default CompanyDetails;
