import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import superAgentService from '../../features/superagent/superAgentService';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    superAgentService
      .getAnalytics(user.token)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message || 'Could not fetch analytics');
        setLoading(false);
      });
  }, [user.token]);

  if (loading) return <Spinner />;

  const { totalTickets, newTickets, openTickets, closedTickets, averageResponseTime } = stats || {};
  const { days, hours, minutes, seconds } = averageResponseTime || {};

  return (
    <div>
      <h1 className="heading">System Analytics</h1>
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p className="stat-value">{totalTickets}</p>
        </div>
        <div className="stat-card">
          <h3>New Tickets</h3>
          <p className="stat-value">{newTickets}</p>
        </div>
        <div className="stat-card">
          <h3>Open Tickets</h3>
          <p className="stat-value">{openTickets}</p>
        </div>
        <div className="stat-card">
          <h3>Closed Tickets</h3>
          <p className="stat-value">{closedTickets}</p>
        </div>
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Average Response Time</h3>
          <p className="stat-value time-value">
            {days > 0 && `${days}d `}
            {hours > 0 && `${hours}h `}
            {minutes}m {seconds}s
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;