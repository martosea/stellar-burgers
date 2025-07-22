import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders } from '../../services/slices/orders/orders-slice';
import { getFeed } from '../../services/slices/feed/feed-slice';
import {
  fetchOrderDetails,
  getOrder
} from '../../services/slices/order/order-slice';
import { useParams } from 'react-router-dom';
import { getIngredients } from '../../services/slices/ingridients/ingridients-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const order = useSelector(getOrder);
  const orders = useSelector(getOrders);
  const feed = useSelector(getFeed);

  const id = useParams().number;

  useEffect(() => {
    dispatch(fetchOrderDetails(Number(id)));
  }, [dispatch, id]);
  const orderData = useMemo(() => {
    if (orders.length) {
      const data = orders.find((order) => String(order.number) === id);
      if (data) return data;
    }
    if (feed.orders.length) {
      const data = feed.orders.find((order) => String(order.number) === id);
      if (data) return data;
    }

    if (order && String(order.number) === id) {
      return order;
    }
  }, [orders, feed.orders, order, id]);

  const ingredients: TIngredient[] = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
