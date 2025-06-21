import { Box, Typography, Avatar, Grid, Link } from '@mui/material';
import { teamMembers } from './teamData';
import { StyledBox, StyledCard } from './style';

const AboutUsPage = () => {
  return (
    <StyledBox>
      <Typography variant="h3" gutterBottom textAlign="center">
        Meet Our Development Team
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {teamMembers.map((member) => (
          <Box
            key={member.name}
            sx={{
              flex: '1 1 300px', // minimum genişlik 300px, esnek büyür
              maxWidth: 360,
            }}
          >
            <StyledCard>
              <Avatar
                alt={member.name}
                src={member.photo}
                sx={{ width: 120, height: 120, marginBottom: 2, mx: 'auto' }}
              />
              <Typography variant="h6" color="text.secondary" textAlign="center">
                {member.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                {member.role}
              </Typography>
              <Typography variant="body2" mt={1} color="text.secondary" textAlign="center">
                {member.bio}
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                fontWeight="bold"
                color="text.secondary"
                textAlign="center"
              >
                Contribution:
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {member.contribution}
              </Typography>
              <Link
                href={member.github}
                target="_blank"
                rel="noopener"
                mt={1}
                display="block"
                textAlign="center"
              >
                GitHub Profile
              </Link>
            </StyledCard>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Link href="https://rs.school/" target="_blank">
          <img src="/rss-logo.svg" alt="RSS Logo" style={{ width: '100px', height: 'auto' }} />
        </Link>
      </Box>
    </StyledBox>
  );
};

export default AboutUsPage;
