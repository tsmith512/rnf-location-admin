import { CardMedia } from '@mui/material';
import React from 'react';

interface StaticMapsProps {
  lat?: number;
  lon?: number;
  zoom?: number;
  marker?: boolean;
  line?: string;
}

export const StaticMap: React.FC<StaticMapsProps> = (props) => {
  const options = [
    `key=${process.env.REACT_APP_GMAPS_API_KEY}`,
    `size=640x640&scale=2`,
    `maptype=roadmap`,
  ];

  if (props.marker) {
    options.push(`zoom=${props.zoom || 10}`);
    options.push(`center=${props.lat},${props.lon}`);
    options.push(`markers=color:red%7C${props.lat},${props.lon}`);
  }

  if (props.line) {
    options.push(`path=color:red%7Cweight:3%7Cenc:${props.line}`)
  }

  return (
    <CardMedia component="img" image={`https://maps.googleapis.com/maps/api/staticmap?` + options.join('&')} />
  );
}
