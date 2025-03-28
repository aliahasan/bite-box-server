import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { categoryRoutes } from '../modules/category/category.route';
import { flashSaleRoutes } from '../modules/flashSell/flashSale.routes';
import { fooCartRoutes } from '../modules/foodCart/foodCart.route';
import { mealRoutes } from '../modules/meal/meal.route';
import { customerMetaRoutes } from '../modules/meta/customeMeta/customerMeta.route';
import { providerMetaRoutes } from '../modules/meta/providerMeta/providerMeta.route';
import { orderRoutes } from '../modules/order/order.route';
import { providerRoutes } from '../modules/provider/provider.route';
import { reviewRoutes } from '../modules/reviews/review.route';
import { sslRoutes } from '../modules/sslcommerz/sslcommerz.routes';
import { userRoutes } from '../modules/user/user.route';
const router = Router();
const appRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/foodcart',
    route: fooCartRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/meal',
    route: mealRoutes,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
  {
    path: '/ssl',
    route: sslRoutes,
  },
  {
    path: '/foodcart-meal',
    route: providerRoutes,
  },
  {
    path: '/flash-sale',
    route: flashSaleRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/providermeta',
    route: providerMetaRoutes,
  },
  {
    path: '/customermeta',
    route: customerMetaRoutes,
  },
];
appRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
