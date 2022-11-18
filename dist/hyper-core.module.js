"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var HyperCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperCoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const hyper_1 = require("hyper");
const common_2 = require("./common");
const hyper_constants_1 = require("./hyper.constants");
let HyperCoreModule = HyperCoreModule_1 = class HyperCoreModule {
    constructor(options, moduleRef) {
        this.options = options;
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger('HyperModule');
    }
    static forRoot(options) {
        const hyperOptions = {
            provide: hyper_constants_1.HYPER_MODULE_OPTIONS,
            useValue: options,
        };
        const poolProvider = {
            provide: (0, common_2.getPoolToken)(options),
            useFactory: () => __awaiter(this, void 0, void 0, function* () { return this.createPoolFactory(options); }),
        };
        return {
            module: HyperCoreModule_1,
            providers: [poolProvider, hyperOptions],
            exports: [poolProvider],
        };
    }
    static forRootAsync(options) {
        const poolProvider = {
            provide: (0, common_2.getPoolToken)(options),
            useFactory: (hyperOptions) => __awaiter(this, void 0, void 0, function* () {
                if (options.name) {
                    return this.createPoolFactory(Object.assign(Object.assign({}, hyperOptions), { name: options.name }));
                }
                return this.createPoolFactory(hyperOptions);
            }),
            inject: [hyper_constants_1.HYPER_MODULE_OPTIONS],
        };
        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: HyperCoreModule_1,
            imports: options.imports,
            providers: [
                ...asyncProviders,
                poolProvider,
                {
                    provide: hyper_constants_1.HYPER_MODULE_ID,
                    useValue: (0, common_2.generateString)(),
                },
            ],
            exports: [poolProvider],
        };
    }
    onApplicationShutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = this.moduleRef.get((0, common_2.getPoolToken)(this.options));
            try {
                yield (pool === null || pool === void 0 ? void 0 : pool.end());
            }
            catch (e) {
                this.logger.error(e === null || e === void 0 ? void 0 : e.message);
            }
        });
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: hyper_constants_1.HYPER_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        const inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: hyper_constants_1.HYPER_MODULE_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () { return optionsFactory.createHyperOptions(options.name); }),
            inject,
        };
    }
    static createPoolFactory(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const poolToken = (0, common_2.getPoolName)(options);
            return yield (0, rxjs_1.lastValueFrom)((0, rxjs_1.defer)(() => __awaiter(this, void 0, void 0, function* () {
                const pool = yield (0, hyper_1.createPool)(options.connectionUri);
                return pool;
            })).pipe((0, common_2.handleRetry)(options.retryAttempts, options.retryDelay, poolToken, options.verboseRetryLog, options.toRetry)));
        });
    }
};
HyperCoreModule = HyperCoreModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({}),
    __param(0, (0, common_1.Inject)(hyper_constants_1.HYPER_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, core_1.ModuleRef])
], HyperCoreModule);
exports.HyperCoreModule = HyperCoreModule;
