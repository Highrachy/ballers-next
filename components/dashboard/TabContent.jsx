import React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';

export const TabContent = ({ title, allTabs }) => {
  return (
    <section className="container-fluid mt-5">
      <h4 className="mb-3">{title}</h4>
      <Tabs
        defaultActiveKey={allTabs[0].title}
        id="tranasction-tabs"
        className="mb-3"
      >
        {allTabs.map((tab, index) => (
          <Tab key={index} eventKey={tab.title} title={tab.title}>
            {tab.component}
          </Tab>
        ))}
      </Tabs>
    </section>
  );
};

export default TabContent;
