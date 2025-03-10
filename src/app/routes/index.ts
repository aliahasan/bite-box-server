import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { fooCartRoutes } from '../modules/foodCart/foodCart.route';
import { mealRoutes } from '../modules/meal/meal.route';
import { orderRoutes } from '../modules/order/order.route';
import { providerRoutes } from '../modules/provider/provider.route';
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
    path: '/order',
    route: orderRoutes,
  },
  {
    path: '/ssl',
    route: sslRoutes,
  },
  {
    path: '/meal',
    route: mealRoutes,
  },
  {
    path: '/foodcart-meal',
    route: providerRoutes,
  },
];
appRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
