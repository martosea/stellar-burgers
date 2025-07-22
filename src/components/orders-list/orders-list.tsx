import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI, Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { getOrderState } from '../../services/slices/orders/orders-slice';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const { ordersLoading } = useSelector(getOrderState);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (ordersLoading) {
    return <Preloader />;
  }
  return <OrdersListUI orderByDate={orderByDate} />;
});
