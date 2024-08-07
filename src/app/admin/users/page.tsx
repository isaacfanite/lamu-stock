'use client';
import { Box, Text } from '@chakra-ui/react';
import Users from 'views/admin/users/components/users';
import React from 'react';

export default function DataTables() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {user.role?.trim().toLowerCase() === 'admin' ? (
        <Users />
      ) : (
        <Text>You are not authorized to view this page</Text>
      )}
    </Box>
  );
}
