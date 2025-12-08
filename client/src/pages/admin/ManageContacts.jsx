/**
 * ManageContacts Page
 */

import React from 'react';
import Container from '@components/layout/Container';
import ContactList from '@components/admin/ContactList';

const ManageContacts = () => {
  return (
    <div className="py-8">
      <Container>
        <ContactList />
      </Container>
    </div>
  );
};

export default ManageContacts;
