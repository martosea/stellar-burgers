import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: null | TIngredient;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addConstructorIngredient: {
      prepare: (ingredient: TIngredient) => {
        const id = `ing-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        return { payload: { ...ingredient, id } };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      }
    },
    removeConstructorIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveConstructorIngredient: (
      state,
      action: PayloadAction<{ index: number; type: 'up' | 'down' }>
    ) => {
      const { index, type } = action.payload;
      const ingredients = state.ingredients;

      if (type === 'up' && index > 0) {
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }

      if (type === 'down' && index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBun: (state) => state.bun,
    getConstructorIngredients: (state) => state.ingredients,
    getConstructorItems: (state) => state
  }
});

export const { getBun, getConstructorIngredients, getConstructorItems } =
  burgerConstructorSlice.selectors;

export const {
  addBun,
  addConstructorIngredient,
  removeConstructorIngredient,
  moveConstructorIngredient,
  resetConstructor
} = burgerConstructorSlice.actions;
