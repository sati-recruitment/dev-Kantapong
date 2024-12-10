import {
  Box,
  Button,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CardList from "../components/cardList";
import { useState } from "react";

export interface ImageItemType {
  id: string;
  url: string;
  width: number;
  height: number;
}

const API_KEY =
  "live_UMIEHUqwTGnUFY8TiJrv60nSuK36A42ddgNtFcb9YWb4lsQgXUJGvfJ4xcJfnlqA";

const Home = () => {
  const [images, setImages] = useState<ImageItemType[]>([]);
  const [numberValue, setNumberValue] = useState<string>("1");
  const [isErrorNumber, setIsErrorNumber] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRandomImage = async () => {
    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&limit=${numberValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  const onClickRandom = () => {
    const parseNumber = Number(numberValue);
    setIsLoading(true);
    if (parseNumber < 1 || parseNumber > 10) {
      setIsErrorNumber(true);
      setIsLoading(false);
    } else {
      setIsErrorNumber(false);
      getRandomImage();
    }
  };

  return (
    <Stack spacing={2} padding={1} data-testid="main">
      <Typography variant="h3" component="h1">
        Cat Gallery
      </Typography>
      <Stack>
        <TextField
          error={isErrorNumber}
          fullWidth
          inputProps={{
            "data-testid": "images-number-field",
          }}
          label="Images Number"
          type="number"
          helperText={isErrorNumber && "Number should be between 1 and 10"}
          value={numberValue}
          onChange={(e) => setNumberValue(e.target.value)}
        />
        <Button
          data-testid="random-image-btn"
          disableElevation
          variant="contained"
          fullWidth
          onClick={onClickRandom}
        >
          Random
        </Button>
      </Stack>
      <Box sx={{ width: "100%" }} data-testid="loading-indicator">
        {isLoading && <LinearProgress />}
      </Box>
      <CardList images={images} />
    </Stack>
  );
};

export default Home;
