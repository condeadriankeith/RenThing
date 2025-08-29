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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        // Check if admin users already exist
        const existingAdmin1 = yield prisma_1.prisma.user.findUnique({
            where: { email: 'adriankeithconde@gmail.com' }
        });
        const existingAdmin2 = yield prisma_1.prisma.user.findUnique({
            where: { email: 'roelslumauagjr@gmail.com' }
        });
        // Create admin accounts if they don't exist
        if (!existingAdmin1) {
            const hashedPassword1 = yield bcryptjs_1.default.hash('admin123', 10);
            yield prisma_1.prisma.user.create({
                data: {
                    email: 'adriankeithconde@gmail.com',
                    name: 'Admin User 1',
                    password: hashedPassword1,
                    role: 'ADMIN',
                },
            });
            console.log('Created admin account: adriankeithconde@gmail.com');
        }
        else {
            console.log('Admin account already exists: adriankeithconde@gmail.com');
        }
        if (!existingAdmin2) {
            const hashedPassword2 = yield bcryptjs_1.default.hash('admin123', 10);
            yield prisma_1.prisma.user.create({
                data: {
                    email: 'roelslumauagjr@gmail.com',
                    name: 'Admin User 2',
                    password: hashedPassword2,
                    role: 'ADMIN',
                },
            });
            console.log('Created admin account: roelslumauagjr@gmail.com');
        }
        else {
            console.log('Admin account already exists: roelslumauagjr@gmail.com');
        }
        console.log('Seeding completed!');
        console.log('Admin credentials:');
        console.log('Email: adriankeithconde@gmail.com, Password: admin123');
        console.log('Email: roelslumauagjr@gmail.com, Password: admin123');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.$disconnect();
}));
