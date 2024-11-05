import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

const HorizontalButtonGroup = () => {
    const [openBox1, setOpenBox1] = useState(false);
    const [openBox2, setOpenBox2] = useState(false);
    const [openBox3, setOpenBox3] = useState(false);

    const handleOpenBox1 = () => {
        setOpenBox1(true);
        setOpenBox2(false);
        setOpenBox3(false);
    };

    const handleOpenBox2 = () => {
        setOpenBox2(true);
        setOpenBox1(false);
        setOpenBox3(false);
    };

    const handleOpenBox3 = () => {
        setOpenBox3(true);
        setOpenBox1(false);
        setOpenBox2(false);
    };

    const handleClose = () => {
        setOpenBox1(false);
        setOpenBox2(false);
        setOpenBox3(false);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-around" mb={2}>
                <Button variant="contained" onClick={handleOpenBox1}>
                    Button 1
                </Button>
                <Button variant="contained" onClick={handleOpenBox2}>
                    Button 2
                </Button>
                <Button variant="contained" onClick={handleOpenBox3}>
                    Button 3
                </Button>
            </Box>

            {/* Modal for Box 1 */}
            <Modal open={openBox1} onClose={handleClose}>
                <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
                    <Typography variant="h6">Box 1</Typography>
                    <Typography>Content for Box 1 goes here.</Typography>
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>

            {/* Modal for Box 2 */}
            <Modal open={openBox2} onClose={handleClose}>
                <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
                    <Typography variant="h6">Box 2</Typography>
                    <Typography>Content for Box 2 goes here.</Typography>
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>

            {/* Modal for Box 3 */}
            <Modal open={openBox3} onClose={handleClose}>
                <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
                    <Typography variant="h6">Box 3</Typography>
                    <Typography>Content for Box 3 goes here.</Typography>
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default HorizontalButtonGroup;
