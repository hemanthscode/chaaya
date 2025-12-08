/**
 * ManageCategories Page
 */

import React from 'react';
import Container from '@components/layout/Container';
import CategoryManager from '@components/admin/CategoryManager';

const ManageCategories = () => {
  return (
    <div className="py-8">
      <Container>
        <CategoryManager />
      </Container>
    </div>
  );
};

export default ManageCategories;
