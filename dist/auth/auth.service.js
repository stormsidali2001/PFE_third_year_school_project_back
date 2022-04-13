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
const student_repository_1 = require("../core/repositories/student.repository");
const student_entity_1 = require("../core/entities/student.entity");
const reset_password_token_repository_1 = require("../core/repositories/reset.password.token.repository");
const crypto_1 = require("crypto");
const nodemailer = require("nodemailer");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const argon = require("argon2");
let AuthService = class AuthService {
    constructor(userRepository, studentRepository, resetPasswordTokenRepository, jwtService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
        this.jwtService = jwtService;
    }
    async signin(data) {
        const manager = (0, typeorm_1.getManager)();
        const { email, password } = data;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.HttpException('Email does not exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const equal = await bcrypt.compare(password, user.password);
        if (!equal) {
            throw new common_1.HttpException('Wrong Password', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.save(user);
        const tokens = await this._getTokens(user.id, user.email);
        await this._updateRefrechTokenHash(user.id, tokens.refrechToken);
        if (user.userType === user_entity_1.UserType.STUDENT) {
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
                .where('student.userId = :userId', { userId: user.id }).getOne();
            return Object.assign(Object.assign({}, tokens), { userType: user.userType, uuid: user.id, email: user.email, firstName: student.firstName, lastName: student.lastName, dob: student.dob, code: student.code, studentId: student.id });
        }
    }
    async signupStudent(data) {
        var _a, _b, _c, _d;
        try {
            const { email, password, firstName, lastName, dob, code } = data;
            let user = await this.userRepository.findOne({ where: { email } });
            const name = (_a = email === null || email === void 0 ? void 0 : email.split('@')[0]) === null || _a === void 0 ? void 0 : _a.split('.')[0];
            const lastNameEmail = (_b = email === null || email === void 0 ? void 0 : email.split('@')[0]) === null || _b === void 0 ? void 0 : _b.split('.')[1];
            const service = (_c = email === null || email === void 0 ? void 0 : email.split('@')[1]) === null || _c === void 0 ? void 0 : _c.split('.')[0];
            const domain = (_d = email === null || email === void 0 ? void 0 : email.split('@')[1]) === null || _d === void 0 ? void 0 : _d.split('.')[1];
            if ((name === null || name === void 0 ? void 0 : name.length) > 0 && (lastNameEmail === null || lastNameEmail === void 0 ? void 0 : lastNameEmail.length) > 0 && service !== 'esi-sba' && domain != 'dz') {
                throw new common_1.HttpException("le mail doit etre un mail scholaire!", common_1.HttpStatus.BAD_REQUEST);
            }
            if (user) {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (password.match(regex) == null) {
                throw new common_1.HttpException('Password must contain at least a special character,at least a capital letter,at least a number and at least 8 characters', common_1.HttpStatus.BAD_REQUEST);
            }
            user = this.userRepository.create({ email, password, userType: user_entity_1.UserType.STUDENT });
            user.password = await bcrypt.hash(user.password, 10);
            const student = this.studentRepository.create({ firstName, lastName, dob, code });
            student.user = user;
            user = await this.userRepository.save(user);
            await this.studentRepository.save(student);
            const tokens = await this._getTokens(user.id, user.email);
            await this._updateRefrechTokenHash(user.id, tokens.refrechToken);
            return tokens;
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupStudent");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signupTeacher(data) {
    }
    async signupEnterprise(data) {
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        const service = email.split('@')[1].split('.')[0];
        const domain = email.split('@')[1].split('.')[1];
        if (service !== 'esi-sba' && domain != 'dz') {
            throw new common_1.HttpException("le mail doit etre un mail scholaire!", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!user) {
            throw new common_1.HttpException("email does not exist", common_1.HttpStatus.BAD_REQUEST);
        }
        const userTokenInDb = await this.resetPasswordTokenRepository.createQueryBuilder('tokens').where('tokens.userId = :userId', { userId: user.id }).getOne();
        if (userTokenInDb) {
            this.resetPasswordTokenRepository.delete(userTokenInDb.id);
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
            from: '"It experts👻" <assoulsidali@gmail.com>',
            to: email,
            subject: "Hello ✔",
            html: `<b>vous avez envoyer une demmande de reincialisation de mot de passe presser sur le lien si il s'agit bien de vous </b><br/> le lien:  http://localhost:3000/resetpassword/${token}?uid=${user.id}`,
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return "check you email please";
    }
    async resetPassword(password, token, userId) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password.match(regex) == null) {
            throw new common_1.HttpException('mot de passe tres faible', common_1.HttpStatus.BAD_REQUEST);
        }
        const resetPasswordToken = await this.resetPasswordTokenRepository.createQueryBuilder('tokens').where('tokens.userId = :userId', { userId }).getOne();
        common_1.Logger.log(`tokenDb:${resetPasswordToken}`, "restPassword");
        if (!resetPasswordToken) {
            throw new common_1.HttpException("bad url", common_1.HttpStatus.FORBIDDEN);
        }
        if (resetPasswordToken.token != token) {
            throw new common_1.HttpException("wrong token", common_1.HttpStatus.FORBIDDEN);
        }
        if (Date.now() >= resetPasswordToken.createdAt.getTime() + resetPasswordToken.expiresIn) {
            await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
            throw new common_1.HttpException("token expired!!", common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne(userId);
        user.password = await bcrypt.hash(password, 10);
        await this.userRepository.save(user);
        await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);
        return `${user.email} password has been reset succesfully`;
    }
    async refrechToken(userId, refrechToken) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const userRepository = manager.getRepository(user_entity_1.UserEntity);
            const user = await userRepository.findOne({ id: userId });
            if (!user || !user.refrechTokenHash) {
                common_1.Logger.error("acces denied:user not found or user does not have a refresh token", "AuthService/refrechToken");
                throw new common_1.HttpException("acces denied", common_1.HttpStatus.FORBIDDEN);
            }
            const matches = await argon.verify(user.refrechTokenHash, refrechToken);
            if (!matches) {
                common_1.Logger.error("acces denied: wrong refrech token", "AuthService/refrechToken");
                throw new common_1.HttpException("acces denied", common_1.HttpStatus.FORBIDDEN);
            }
            const tokens = await this._getTokens(user.id, user.email);
            await this._updateRefrechTokenHash(user.id, tokens.refrechToken);
            return tokens;
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/refrechToken");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const userRepository = manager.getRepository(user_entity_1.UserEntity);
            const user = await userRepository.findOne({ id: userId });
            if (!user) {
                common_1.Logger.error("acces denied:user not found ", "AuthService/logout");
                throw new common_1.HttpException("acces denied", common_1.HttpStatus.FORBIDDEN);
            }
            await userRepository.update({ id: userId }, { refrechTokenHash: null });
            return "logout success";
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/logout");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async _getTokens(userId, email) {
        const jwtPayload = {
            uuid: userId,
            email
        };
        const [accesToken, refrechToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn: '15m'
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.REFRECH_TOKEN_SECRET,
                expiresIn: '7d'
            })
        ]);
        return {
            accesToken,
            refrechToken
        };
    }
    async _updateRefrechTokenHash(userId, refrechToken) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const userRepository = manager.getRepository(user_entity_1.UserEntity);
            const refrechTokenHash = await argon.hash(refrechToken);
            await userRepository.update({ id: userId }, { refrechTokenHash });
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/_updateRefrechTokenHash");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        student_repository_1.StudentRepository,
        reset_password_token_repository_1.RestPasswordTokenRepository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map