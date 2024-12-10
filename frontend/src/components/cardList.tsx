import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import { ImageItemType } from "../pages/home";

const CardList = ({ images }: { images: ImageItemType[] }) => {
  return (
    <Grid container spacing={1} data-testid="images-list">
      {images?.map((imageItem: ImageItemType) => (
        <Grid key={imageItem.id} item xs={12} md={4} data-testid="image-item">
          <Card variant="outlined">
            <CardMedia
              component="img"
              alt="image-alt"
              height={300}
              width="100%"
              image={imageItem.url}
              loading="lazy"
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Size: {imageItem.width.toLocaleString()} x {imageItem.height.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardList;
