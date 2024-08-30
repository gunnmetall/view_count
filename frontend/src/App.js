import React, { useState } from 'react';
import ReportForm from './components/ReportForm';
import ReportDisplay from './components/ReportDisplay';


function App() {
  const [reportData, setReportData] = useState([]);

  const fetchReport = async (startDate, endDate) => {
    try {
      const response = await fetch(`http://localhost:8100/api/reports/getViewReport?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div>
      <h1>User Count</h1>
      <ReportForm fetchReport={fetchReport} />
      <ReportDisplay reportData={reportData} />
    </div>
  );
}

export default App;
