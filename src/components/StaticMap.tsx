import { CardMedia } from '@mui/material';
import React from 'react';

interface StaticMapsProps {
  lat: number;
  lon: number;
  zoom?: number;
  marker?: boolean;
}

export const StaticMap: React.FC<StaticMapsProps> = (props) => {
  const options = [
    `key=${process.env.REACT_APP_GMAPS_API_KEY}`,
    `center=${props.lat},${props.lon}`,
    `zoom=${props.zoom || 10}`,
    `size=640x640&scale=2`,
    `maptype=roadmap`,
  ];

  if (props.marker) {
    options.push(`markers=color:red%7C${props.lat},${props.lon}`);
  }

  return (
    <CardMedia component="img" image={`https://maps.googleapis.com/maps/api/staticmap?` + options.join('&')} />
  );
}
