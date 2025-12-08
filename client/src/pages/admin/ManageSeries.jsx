/**
 * ManageSeries Page
 */

import React from 'react';
import Container from '@components/layout/Container';
import SeriesManager from '@components/admin/SeriesManager';

const ManageSeries = () => {
  return (
    <div className="py-8">
      <Container>
        <SeriesManager />
      </Container>
    </div>
  );
};

export default ManageSeries;
