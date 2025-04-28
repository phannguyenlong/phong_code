import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';

const RateLimitError = ({ message = 'Too many requests! Please try again later.' }) => {
  return (
    <Box position="fixed" top="4" right="4" zIndex="1000">
      <Alert status="error" variant="solid" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Rate Limit Exceeded</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
};

export default RateLimitError; 