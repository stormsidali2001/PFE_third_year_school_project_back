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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../core/repositories/user.repository");
const user_entity_1 = require("../core/entities/user.entity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const student_repository_1 = require("../core/repositories/student.repository");
const reset_password_token_repository_1 = require("../core/repositories/reset.password.token.repository");
const crypto_1 = require("crypto");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    constructor(userRepository, studentRepository, resetPasswordTokenRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
    }
    async signin(data) {
        const { email, password } = data;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.HttpException('Email does not exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const equal = await bcrypt.compare(password, user.password);
        if (!equal) {
            throw new common_1.HttpException('Wrong Password', common_1.HttpStatus.BAD_REQUEST);
        }
        this.userRepository.save(user);
        const token = jwt.sign({
            id: user.id, email
        }, process.env.SECRET, {
            expiresIn: '1d'
        });
        const responseOBj = { id: user.id, createdAt: user.createdAt, email: user.email, token };
        return responseOBj;
    }
    async signupStudent(data) {
        const { email, password, firstName, lastName, dob, code } = data;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new common_1.HttpException('Email already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        user = this.userRepository.create({ email, password, userType: user_entity_1.UserType.STUDENT });
        user.password = await bcrypt.hash(user.password, 10);
        const student = this.studentRepository.create({ firstName, lastName, dob, code });
        student.user = user;
        user = await this.userRepository.save(user);
        await this.studentRepository.save(student);
        const responseOBj = { id: user.id, createdAt: user.createdAt, email: user.email };
        return responseOBj;
    }
    async signupTeacher(data) {
    }
    async signupEnterprise(data) {
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.HttpException("email does not exist", common_1.HttpStatus.BAD_REQUEST);
        }
        var token = await new Promise((resolve, reject) => {
            (0, crypto_1.randomBytes)(32, (err, buf) => {
                if (err)
                    reject(err);
                resolve(buf.toString('hex'));
            });
        });
        const expiresIn = 15 * 60 * 1000;
        const resetPasswordToken = this.resetPasswordTokenRepository.create({ user, expiresIn, token: token });
        await this.resetPasswordTokenRepository.save(resetPasswordToken);
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "assoulsidali@gmail.com",
                pass: "mydreamismylife@",
            },
        });
        let info = await transporter.sendMail({
            from: '"booooooooooowaaa3 👻" <assoulsidali@gmail.com>',
            to: "sidalihouda.computerscience@gmail.com",
            subject: "Hello ✔",
            text: `Hello world? http://localhost:8080/resetpassword/${token}/${user.id}`,
            html: `<b>Hello world?</b> Hello world? http://localhost:3000/resetpassword/${token}/${user.id}`,
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return "check you email please";
    }
    async resetPassword(password, token, userId) {
        const resetPasswordToken = await this.resetPasswordTokenRepository.findOne({ where: { userId } });
        if (!resetPasswordToken) {
            throw new common_1.HttpException("bad url", common_1.HttpStatus.FORBIDDEN);
        }
        if (resetPasswordToken.token != token) {
            throw new common_1.HttpException("wrong token", common_1.HttpStatus.FORBIDDEN);
        }
        if (resetPasswordToken.createdAt.getTime() + resetPasswordToken.expiresIn >= Date.now()) {
            await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
            throw new common_1.HttpException("token expired!!", common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne(userId);
        user.password = await bcrypt.hash(password, 10);
        await this.userRepository.save(user);
        await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
        return `${user.email} password has been rest succesfully`;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        student_repository_1.StudentRepository,
        reset_password_token_repository_1.RestPasswordTokenRepository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map