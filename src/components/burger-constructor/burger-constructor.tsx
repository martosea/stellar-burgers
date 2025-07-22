import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  resetConstructor
} from '../../services/slices/constructor/constructor-slice';
import {
  createOrder,
  getIsNewOrderLoading,
  getOrderModalData,
  resetOrderModalData
} from '../../services/slices/orders/orders-slice';
import { getUserState } from '../../services/slices/user/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getIsNewOrderLoading);
  const orderModalData = useSelector(getOrderModalData);
  const { isUserAuthorised } = useSelector(getUserState);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isUserAuthorised) {
      navigate('/login');
      return;
    }

    const data = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingrid: TConstructorIngredient) => ingrid._id
      ),
      constructorItems.bun._id
    ];
    dispatch(createOrder(data));
  };
  const closeOrderModal = () => {
    if (!orderRequest) {
      dispatch(resetOrderModalData());
      dispatch(resetConstructor());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (a: number, b: TConstructorIngredient) => a + b.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
