import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useJobStore from "../store/useJobStore";
import companyService from "../services/companyService";

const JobDetails = () => {
  const { id } = useParams();
  const { jobs, loadJobs, saveJob, savedJobs } = useJobStore();

  const [job, setJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const found = jobs.find((j) => j.id === id);
    setJob(found || null);
  }, [jobs, id]);

  if (!job) return <p className="text-gray-500">Loading job details...</p>;

  const company = companyService.getById(job.companyId);
  const isSaved = savedJobs.some((s) => s.id === job.id);

  return (
    <div className="max-w-4xl mx-auto text-gray-900">

      {/* Title + Company */}
<h1 className="text-4xl font-extrabold text-white">
  {job.title}
</h1>

      <p className="text-gray-600 mt-1">
        {company.name} • {job.location}
      </p>

      {/* Save Button */}
      <button
        onClick={() => saveJob(job)}
        className={`mt-5 px-5 py-2 rounded-lg text-white font-medium transition
          ${isSaved ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isSaved ? "Saved" : "Save Job"}
      </button>

      {/* Job Info Card */}
      <div className="card p-6 mt-8">

<h2 className="text-xl font-semibold mb-3 text-white">Job Details</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>

        {/* Requirements */}
<h3 className="text-lg font-semibold mt-5 mb-2 text-white">Requirements</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {job.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        {/* Salary */}
<h3 className="text-lg font-semibold mt-5 mb-2 text-white">Salary</h3>
        <p className="text-blue-600 font-semibold">
          ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
        </p>

        {/* Date */}
        <p className="mt-4 text-gray-500 text-sm">
          Posted on {job.postedAt}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;
