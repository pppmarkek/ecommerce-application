import React, { useEffect, useState } from 'react';
import { getCustomerProfileMe } from '@/services/api';
import { Container, Card, Row, Label, Value } from './style';

import { Button } from '@/components/Button/Button';
import { Box, Modal } from '@mui/material';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';

interface Address {
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Profile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  addresses?: Address[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Access token not found');

        const profileData = await getCustomerProfileMe(accessToken);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        <Row>
          <Label>Name:</Label>
          <Value>{profile.firstName ?? '-'}</Value>
        </Row>
        <Row>
          <Label>Surname:</Label>
          <Value>{profile.lastName ?? '-'}</Value>
        </Row>
        <Row>
          <Label>Birth Date:</Label>
          <Value>{profile.dateOfBirth ?? '-'}</Value>
        </Row>
      </Card>

      <Card>
        <span>Billing Address</span>
        <Row>
          <Label>Street:</Label>
          <Value>{profile.addresses?.[0].streetName}</Value>
        </Row>
        <Row>
          <Label>City:</Label>
          <Value>{profile.addresses?.[0].city}</Value>
        </Row>
        <Row>
          <Label>Postal Code:</Label>
          <Value>{profile.addresses?.[0].postalCode}</Value>
        </Row>
        <Row>
          <Label>Country:</Label>
          <Value>{profile.addresses?.[0].country}</Value>
        </Row>
      </Card>

      <Card>
        <span>Shipping Address</span>
        <Row>
          <Label>Street:</Label>
          <Value>{profile.addresses?.[1].streetName}</Value>
        </Row>
        <Row>
          <Label>City:</Label>
          <Value>{profile.addresses?.[1].city}</Value>
        </Row>
        <Row>
          <Label>Postal Code:</Label>
          <Value>{profile.addresses?.[1].postalCode}</Value>
        </Row>
        <Row>
          <Label>Country:</Label>
          <Value>{profile.addresses?.[1].country}</Value>
        </Row>
      </Card>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={handleOpen}>
          Edit
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#2c2c2c',
            color: '#fff',
            boxShadow: 24,
            p: 3,
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 2,
          }}
        >
          <EditProfileForm />
        </Box>
      </Modal>
    </Container>
  );
}
