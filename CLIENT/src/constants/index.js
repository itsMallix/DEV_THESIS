import { createCampaign, dashboard, logout, payment, staking, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'history',
    imgUrl: payment,
    link: '/history',
  },
  {
    name: 'claim',
    imgUrl: withdraw,
    link: '/claim',
  },
  {
    name: 'staking',
    imgUrl: staking,
    link: '/staking',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];
