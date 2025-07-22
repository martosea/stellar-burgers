import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { getUser } from '../../services/slices/user/user-slice';

export const AppHeader: FC = () => (
  <AppHeaderUI userName={useSelector(getUser).name} />
);
