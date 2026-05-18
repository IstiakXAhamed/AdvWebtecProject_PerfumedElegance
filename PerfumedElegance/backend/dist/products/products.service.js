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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const brands_service_1 = require("../brands/brands.service");
let ProductsService = class ProductsService {
    productsRepository;
    brandsService;
    constructor(productsRepository, brandsService) {
        this.productsRepository = productsRepository;
        this.brandsService = brandsService;
    }
    async create(createProductDto) {
        const brand = await this.brandsService.findOne(createProductDto.brandId);
        const newProduct = this.productsRepository.create({
            ...createProductDto,
            brand,
        });
        return this.productsRepository.save(newProduct);
    }
    async findAll() {
        return this.productsRepository.find();
    }
    async findOne(id) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        let brand = product.brand;
        if (updateProductDto.brandId) {
            brand = await this.brandsService.findOne(updateProductDto.brandId);
        }
        const updatedProduct = this.productsRepository.merge(product, {
            ...updateProductDto,
            brand,
        });
        return this.productsRepository.save(updatedProduct);
    }
    async remove(id) {
        await this.findOne(id);
        await this.productsRepository.delete(id);
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        brands_service_1.BrandsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map