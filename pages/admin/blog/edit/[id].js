import BlogForm from '@/components/pages/admin/NewBlog';
import { useRouter } from 'next/router';
import React from 'react';

const EditBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <BlogForm id={id} />;
};

export default EditBlog;
