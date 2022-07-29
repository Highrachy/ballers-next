import React from 'react';
import BackendPage from 'components/layout/BackendPage';

const KnowledgeBase = () => (
  <BackendPage>
    <Welcome />
  </BackendPage>
);

const Welcome = () => {
  return (
    <section className="container-fluid">
      <div className="dashboard mb-3">
        <h1>Knowledge Base</h1>
        <p className="lead">Coming Soon...</p>
      </div>
    </section>
  );
};

export default KnowledgeBase;
