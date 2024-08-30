import React from 'react';
function ReportDisplay({ reportData }) {
  return (
    <div>
      <h2>Report</h2>
      {reportData.length > 0 ? (
        <ul>
          {reportData.map((report, index) => (
            <li key={index}>
              Product ID: {report.productId}, Total Views: {report.totalUsers}, Unique Users: {report.uniqueUsers}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found for the selected range.</p>
      )}
    </div>
  );
}


export default ReportDisplay;
