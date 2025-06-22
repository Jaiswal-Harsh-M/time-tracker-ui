import React, { useState } from 'react'
import './AppDetailsList.css'
import { appUsageData } from './dummy_data.js'
import { Bar, Pie } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

const ITEMS_PER_PAGE = 8

export default function AppDetailsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [view, setView] = useState('table') // 'table' or 'pie'
  const totalPages = Math.ceil(appUsageData.length / ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const currentData = appUsageData.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  // Chart.js Bar Chart data and options
  const chartData = {
    labels: currentData.map(app => app.applicationName),
    datasets: [
      {
        label: 'Process ID',
        data: currentData.map(app => app.processId),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Process ID by Application',
      },
    },
  }

  // Pie chart data (showing count of records per application)
  const pieData = (() => {
    const usageMap = {}
    appUsageData.forEach(app => {
      usageMap[app.applicationName] = (usageMap[app.applicationName] || 0) + 1
    })
    return {
      labels: Object.keys(usageMap),
      datasets: [
        {
          data: Object.values(usageMap),
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#17a2b8'
          ]
        }
      ]
    }
  })()

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Application Usage</h2>
      <div className="mb-3">
        <button
          className={`btn btn-outline-primary me-2${view === 'table' ? ' active' : ''}`}
          onClick={() => setView('table')}
        >
          Table View
        </button>
        <button
          className={`btn btn-outline-success${view === 'pie' ? ' active' : ''}`}
          onClick={() => setView('pie')}
        >
          Pie Chart View
        </button>
      </div>
      {view === 'table' ? (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Application Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Process ID</th>
                  <th>Sub Application Name</th>
                  <th>Application Details</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((app, idx) => (
                  <tr key={startIdx + idx}>
                    <td>{app.applicationName}</td>
                    <td>{app.startTime}</td>
                    <td>{app.endTime}</td>
                    <td>{app.processId}</td>
                    <td>{app.subApplicationName}</td>
                    <td>{app.applicationDetails}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx} className={`page-item${currentPage === idx + 1 ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: 500, width: '100%' }}>
            <Pie data={pieData} />
          </div>
        </div>
      )}
    </div>
  )
}
