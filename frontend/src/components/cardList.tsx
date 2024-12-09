import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";

const CardList = (props: any) => {
    return (
        <Grid container spacing={1} data-testid="images-list">
            <Grid item xs={12} md={4} data-testid="image-item">
                <Card variant="outlined">
                    <CardMedia
                        component="img"
                        alt="image-alt"
                        height={300}
                        width="100%"
                        image="url"
                        loading="lazy"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            Size: width x height
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CardList;
