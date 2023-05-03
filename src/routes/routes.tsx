import { Home, Trips, TripDetailsV2, TripMaps, Waypoints } from '../screens';

import ExploreIcon from '@mui/icons-material/Explore';
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from '@mui/icons-material/Map';
import RoomIcon from '@mui/icons-material/Room';

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
    path: '/trip/:id',
    title: 'Trip ID',
    screen: TripDetailsV2,
  },
  {
    path: '/maps',
    title: 'Trip Maps',
    icon: MapIcon,
    screen: TripMaps,
  },
  {
    path: '/waypoints',
    title: 'Waypoints',
    icon: RoomIcon,
    screen: Waypoints,
  }
];

export default Routes;
