import Text from '@/components/Text';
import {Box, Container} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import Layout from './[locale]/(visitor)/layout';
import {setStaticParamsLocale} from 'next-international/server';

function NotFoundView() {
  setStaticParamsLocale('en');

  return (
    <Layout>
      <Container maxWidth="md" sx={{my: 2}}>
        <Text align="center" color="textPrimary" h1>
          404: The page you are looking for isn&apos;t here
        </Text>
        <Text align="center" color="textPrimary" subtitle2>
          ou either tried some shady route or you came here by mistake.{' '}
          Whichever it is, try using the navigation
        </Text>
        <Box textAlign="center">
          <Image
            alt="Under development"
            src="/not-found.png"
            width={560}
            height={305}
            style={{
              marginBottom: '50px',
              display: 'inline-block',
              maxWidth: '100%',
            }}
          />
        </Box>
      </Container>
    </Layout>
  );
}

export default NotFoundView;
