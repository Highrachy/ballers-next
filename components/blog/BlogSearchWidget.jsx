import { Form, Formik } from 'formik';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from '../forms/Input';
import Button from '../forms/Button';
import { createSchema } from '../forms/schemas/schema-helpers';
import { searchSchema } from '../forms/schemas/blogSchema';

const BlogSearchWidget = () => {
  return (
    <div className="blog-widget widget-search">
      <Formik
        initialValues={{
          term: '',
        }}
        onSubmit={(values, actions) => {
          router.push(`/blog/search/${values?.term}`);
        }}
        validationSchema={createSchema(searchSchema)}
      >
        {({ isSubmitting, handleSubmit }) => {
          const submitFormWithEnterKey = (event) => {
            if (event.keyCode === 13) {
              handleSubmit();
            }
          };
          return (
            <Form>
              <Input
                label="Search Term"
                name="term"
                onKeyDown={(e) => submitFormWithEnterKey(e)}
                placeholder="Enter search term"
                tabIndex={1}
              />
              <Button loading={isSubmitting} onClick={handleSubmit}>
                Search Articles
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default BlogSearchWidget;
