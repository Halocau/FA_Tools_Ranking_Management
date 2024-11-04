import { Box, Button } from '@mui/material';

const ActionButtons = ({ onCancel, onConfirm, confirmText, cancelText, color }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
                {cancelText}
            </Button>
            <Button variant="contained" color={color} onClick={onConfirm} sx={{ ml: 2 }}>
                {confirmText}
            </Button>
        </Box>
    );
};

export default ActionButtons; 