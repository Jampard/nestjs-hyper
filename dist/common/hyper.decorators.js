"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectPool = void 0;
const common_1 = require("@nestjs/common");
const hyper_utils_1 = require("./hyper.utils");
const InjectPool = (options) => (0, common_1.Inject)((0, hyper_utils_1.getPoolToken)(options));
exports.InjectPool = InjectPool;
