import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useSelector } from 'react-redux';
import { getIngredients } from '../../services/slices/ingridients/ingridients-slice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const ingredients = useSelector(getIngredients);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === params.id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
