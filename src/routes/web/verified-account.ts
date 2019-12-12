const express = require('express');

export const verifiedAccount = express.Router();

import mountResetPasswordRoutes from '../../features/verified-account/routes';

mountResetPasswordRoutes(verifiedAccount);
