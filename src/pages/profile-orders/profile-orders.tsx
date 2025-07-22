import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  getOrders
} from '../../services/slices/orders/orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const orders = useSelector(getOrders);

  return <ProfileOrdersUI orders={orders} />;
};
