const express = require('express');

export const verifiedAccount = express.Router();

import mountResetPasswordRoutes = require('../features/verified-account/routes');

mountResetPasswordRoutes(verifiedAccount);
