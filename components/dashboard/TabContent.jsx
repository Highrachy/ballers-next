import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';

export const TabContent = ({ title, allTabs, activeKey }) => {
  const [key, setKey] = React.useState(activeKey || allTabs[0].title);

  return (
    <section className="container-fluid mt-5">
      {title && <h4 className="mb-3">{title}</h4>}
      <Tabs
        id={`tab-content-${title || 'default'}`}
        activeKey={key}
        onSelect={(k) => setKey(k)}
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
