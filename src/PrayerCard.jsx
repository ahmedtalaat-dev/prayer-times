import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PrayerCard({name, time, image}) {
  return (
    <Card sx={{ maxWidth: 345, margin:"5px"}}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title="prayer"
        loading="lazy"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" style={{color:"black"}}>
          {name}
        </Typography>

        <Typography variant="h2" sx={{ color: 'text.secondary', direction:"ltr" }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
