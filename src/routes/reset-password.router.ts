const express = require('express');

export const resetPassword = express.Router();

import mountResetPasswordRoutes = require('../features/reset-password/routes');

mountResetPasswordRoutes(resetPassword);
