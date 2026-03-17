import React, { useEffect } from "react";
import useJobStore from "../store/useJobStore";
import CompanyCard from "../components/CompanyCard";

const Companies = () => {
  const { companies, loadCompanies } = useJobStore();

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div className="text-gray-900">

  <h1 className="text-4xl font-extrabold text-white mb-6">
  Explore <span className="text-accent-blue">Companies</span>
</h1>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((c) => (
          <CompanyCard key={c.id} company={c} />
        ))}
      </div>

    </div>
  );
};

export default Companies;
