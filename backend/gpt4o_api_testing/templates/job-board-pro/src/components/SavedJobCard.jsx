import React from "react";
import { Link } from "react-router-dom";
import companyService from "../services/companyService";

const SavedJobCard = ({ job, remove }) => {
  const company = companyService.getById(job.companyId);

  return (
    <div className="card p-5 rounded-xl flex justify-between items-center">

      <div className="flex items-center gap-4">
        <img
          src={company.logo}
          alt={company.name}
          className="w-12 h-12 rounded-lg object-cover"
        />

        <div>
          <Link
            to={`/job/${job.id}`}
            className="text-lg font-semibold text-white hover:text-indigo-400 transition"
          >
            {job.title}
          </Link>
          <p className="text-gray-400 text-sm">{company.name}</p>
        </div>
      </div>

      <button
        onClick={() => remove(job.id)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Remove
      </button>

    </div>
  );
};

export default SavedJobCard;
