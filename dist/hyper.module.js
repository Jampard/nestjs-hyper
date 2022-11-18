"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HyperModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperModule = void 0;
const common_1 = require("@nestjs/common");
const hyper_core_module_1 = require("./hyper-core.module");
let HyperModule = HyperModule_1 = class HyperModule {
    static forRoot(options) {
        return {
            module: HyperModule_1,
            imports: [hyper_core_module_1.HyperCoreModule.forRoot(options)],
        };
    }
    static forRootAsync(options) {
        return {
            module: HyperModule_1,
            imports: [hyper_core_module_1.HyperCoreModule.forRootAsync(options)],
        };
    }
};
HyperModule = HyperModule_1 = __decorate([
    (0, common_1.Module)({})
], HyperModule);
exports.HyperModule = HyperModule;
