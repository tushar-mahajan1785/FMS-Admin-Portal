
import Box from '@mui/material/Box';
import { StyledLinearProgress } from '../common';

export default function ProgressBar(props) {
  return (
    <Box sx={{ width: '30%', mr: 1 }}>
      <StyledLinearProgress variant="determinate" {...props} />
    </Box>
  );
}
