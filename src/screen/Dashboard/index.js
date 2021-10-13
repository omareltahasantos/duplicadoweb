import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  return (
    <>
      {currentUser.role === 'admin' && <Redirect to="/home" />}
      {currentUser.role === 'tecnico' && <Redirect to="/projects" />}
    </>
  );
};

export default Dashboard;
