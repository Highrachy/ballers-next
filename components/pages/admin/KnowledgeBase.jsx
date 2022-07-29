import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Editor from 'components/utils/Editor';
import Button from 'components/forms/Button';

const KnowledgeBase = () => (
  <BackendPage>
    <div className="container-fluid">
      <div className="container-fluid">
        <section className="mt-4 p-5">
          <KnowledgeBaseForm />
        </section>
      </div>
    </div>
  </BackendPage>
);

const KnowledgeBaseForm = () => {
  return (
    <>
      <textarea className="knowledgebase__title" placeholder="Title" />
      <Editor />

      <div className="mt-4">
        <Button
          className="btn-secondary"
          // loading={isSubmitting}
          // onClick={handleSubmit}
          showLoadingText={false}
        >
          Save Article
        </Button>
      </div>
    </>
  );
};

export default KnowledgeBase;
