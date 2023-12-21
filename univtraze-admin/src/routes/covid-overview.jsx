import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardOverview from '../components/CardOverview';

export default function CovidOverview() {
  const navigate = useNavigate();

  const { userId, caseId, userType } = useParams();
  const admin = () => {
    navigate('/admin/disease-reports');
  };

  return (
    <>
      <div className="container">
        <h2 className="covid-overview"> Communicable disease overview</h2>
        <CardOverview userData={{ userId, caseId, userType }} />
      </div>
    </>
  );
}
