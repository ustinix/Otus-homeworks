"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var product_1 = require("../../src/stores/product");
var axios_1 = require("axios");
var pinia_1 = require("pinia");
vitest_1.vi.mock('axios');
var mockedAxios = axios_1.default;
var mockFetch = vitest_1.vi.fn();
global.fetch = mockFetch;
(0, vitest_1.describe)('useProductStore', function () {
    var store;
    (0, vitest_1.beforeEach)(function () {
        var pinia = (0, pinia_1.createPinia)();
        (0, pinia_1.setActivePinia)(pinia);
        store = (0, product_1.useProductStore)();
        vitest_1.vi.clearAllMocks();
        mockedAxios.get.mockReset();
        mockedAxios.post.mockReset();
        mockedAxios.delete.mockReset();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)('get product', function () {
        (0, vitest_1.it)('get product successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockProducts = [
                            {
                                id: 1,
                                title: 'Product 1',
                                price: 100,
                                description: 'Description 1',
                                category: 'Category 1',
                                image: 'image1.jpg',
                                rating: { rate: 4.5, count: 100 },
                            },
                            {
                                id: 2,
                                title: 'Product 2',
                                price: 200,
                                description: 'Description 2',
                                category: 'Category 2',
                                image: 'image2.jpg',
                                rating: { rate: 4.0, count: 50 },
                            },
                        ];
                        mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
                        return [4 /*yield*/, store.getProduct(1)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
                        (0, vitest_1.expect)(store.product).toEqual(mockProducts);
                        (0, vitest_1.expect)(store.isLoading).toBe(false);
                        (0, vitest_1.expect)(store.error).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('get error for fail get product', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockError = new Error('Network error');
                        mockedAxios.get.mockRejectedValueOnce(mockError);
                        return [4 /*yield*/, store.getProduct(3)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/3');
                        (0, vitest_1.expect)(store.product).toEqual(null);
                        (0, vitest_1.expect)(store.isLoading).toBe(false);
                        (0, vitest_1.expect)(store.error).toBe(mockError);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
