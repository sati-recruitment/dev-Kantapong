import {
    Box,
    Button,
    LinearProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CardList from "../components/cardList";

const Home = () => {
    return (
        <Stack spacing={2} padding={1} data-testid="main">
            <Typography variant="h3" component="h1">
                Cat Gallery
            </Typography>
            <Stack>
                <TextField
                    fullWidth
                    inputProps={{
                        "data-testid": "images-number-field",
                    }}
                    label="Images Number"
                    type="number"
                    helperText={"Number should be between 1 and 10"}
                />
                <Button
                    data-testid="random-image-btn"
                    disableElevation
                    variant="contained"
                    fullWidth
                >
                    Random
                </Button>
            </Stack>
            <Box sx={{ width: "100%" }} data-testid="loading-indicator">
                <LinearProgress />
            </Box>
            <CardList />
        </Stack>
    );
};

export default Home;
