import React from "react";
import { Link } from "react-router-dom";
import companyService from "../services/companyService";

const JobCard = ({ job }) => {
  const company = companyService.getById(job.companyId);

  return (
    <Link to={`/job/${job.id}`}>
      <div className="card card-hover p-5 cursor-pointer">

        {/* Company Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={company.logo}
            alt={company.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-white">{company.name}</h4>
            <p className="text-sm text-gray-400">{company.industry}</p>
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-xl font-bold text-white">{job.title}</h3>

        {/* Meta */}
        <div className="mt-3 text-sm text-gray-400 flex flex-wrap gap-4">
          <span>📍 {job.location}</span>
          <span>💼 {job.jobType}</span>
          <span>📅 {job.postedAt}</span>
        </div>

        {/* Salary */}
        <p className="mt-4 font-semibold text-indigo-400">
          ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
        </p>

      </div>
    </Link>
  );
};

export default JobCard;
