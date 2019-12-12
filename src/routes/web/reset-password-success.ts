const express = require('express');

export const resetPasswordSuccess = express.Router();

import mountResetPasswordSuccessRoutes from '../../features/reset-password-success/routes';

mountResetPasswordSuccessRoutes(resetPasswordSuccess);
