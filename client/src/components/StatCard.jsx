import React from "react";
function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default StatCard;
