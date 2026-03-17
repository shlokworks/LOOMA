import React from "react";
import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => {
  return (
    <Link to={`/company/${company.id}`}>
      <div className="card card-hover p-6 rounded-xl cursor-pointer">

        <img
          src={company.logo}
          alt={company.name}
          className="w-16 h-16 rounded-lg mb-4 object-cover"
        />

        <h3 className="text-xl font-bold text-white">{company.name}</h3>

        <p className="text-gray-400 text-sm mt-1">{company.industry}</p>

        <p classname="text-gray-500 text-sm mt-2">📍 {company.location}</p>
      </div>
    </Link>
  );
};

export default CompanyCard;
