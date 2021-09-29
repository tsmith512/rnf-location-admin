import { Home, Trips } from '../screens';

import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';

const Routes = [
  {
    path: '/',
    title: 'Home',
    icon: HomeIcon,
    screen: Home,
  },
  {
    path: '/trips',
    title: 'Trips',
    icon: MapIcon,
    screen: Trips,
  },
];

export default Routes;
