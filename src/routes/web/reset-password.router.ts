const express = require('express');

export const resetPassword = express.Router();

import mountResetPasswordRoutes from '../../features/reset-password/routes';

mountResetPasswordRoutes(resetPassword);
