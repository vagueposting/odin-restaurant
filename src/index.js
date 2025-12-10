/* Restaurant!
Last updated 2025-12-09. */

import './styles/landing.css';
import { RestaurantData } from './data.js';
import { Interface } from './display.js';

const data = RestaurantData();
const display = Interface(data)