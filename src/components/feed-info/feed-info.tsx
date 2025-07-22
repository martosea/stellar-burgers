import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { useSelector } from 'react-redux';
import { getFeed, getFeedOrders } from '../../services/slices/feed/feed-slice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const feed = useSelector(getFeed);
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
