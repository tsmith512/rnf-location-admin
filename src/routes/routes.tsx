import { Home, Trips, TripDetails, TripMaps } from '../screens';

import ExploreIcon from '@mui/icons-material/Explore';
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from '@mui/icons-material/Map';

const Routes = [
  {
    path: '/',
    title: 'Home',
    icon: ExploreIcon,
    screen: Home,
  },
  {
    path: '/trips',
    title: 'Trips',
    icon: FolderIcon,
    screen: Trips,
  },
  {
    path: '/maps',
    title: 'Trip Maps',
    icon: MapIcon,
    screen: TripMaps,
  },
  {
    path: '/trip/:id',
    title: 'Trip ID',
    screen: TripDetails,
  },
];

export default Routes;
