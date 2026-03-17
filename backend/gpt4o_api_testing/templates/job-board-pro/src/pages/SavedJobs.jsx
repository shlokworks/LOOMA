import React from "react";
import useJobStore from "../store/useJobStore";
import SavedJobCard from "../components/SavedJobCard";

const SavedJobs = () => {
  const { savedJobs, removeSavedJob } = useJobStore();

  return (
    <div className="text-gray-900">

 <h1 className="text-4xl font-extrabold text-white mb-6">
  Your <span className="text-accent-purple">Saved Jobs</span>
</h1>

      {savedJobs.length === 0 ? (
        <p className="text-gray-600">No saved jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              remove={removeSavedJob}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
