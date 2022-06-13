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
const socket_service_1 = require("../socket/socket.service");
const admin_entity_1 = require("../core/entities/admin.entity");
const teacher_entity_1 = require("../core/entities/teacher.entity");
const promotion_entity_1 = require("../core/entities/promotion.entity");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userRepository, studentRepository, resetPasswordTokenRepository, jwtService, socketService, userService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
        this.jwtService = jwtService;
        this.socketService = socketService;
        this.userService = userService;
    }
    async signin(data) {
        const manager = (0, typeorm_1.getManager)();
        const { email, password } = data;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            common_1.Logger.error("Email does not exists", 'signin/AuthService');
            throw new common_1.HttpException('Email does not exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const equal = await bcrypt.compare(password, user.password);
        if (!equal) {
            common_1.Logger.error("Wrong Password", 'signin/AuthService');
            throw new common_1.HttpException('Wrong Password', common_1.HttpStatus.BAD_REQUEST);
        }
        return { id: user.id };
    }
    async signupStudent(userId, data) {
        var _a, _b, _c, _d;
        try {
            const manager = (0, typeorm_1.getManager)();
            const connectedUser = await manager.getRepository(user_entity_1.UserEntity).createQueryBuilder('cuser')
                .where('cuser.id = :userId', { userId })
                .getOne();
            if (connectedUser.userType !== user_entity_1.UserType.ADMIN) {
                common_1.Logger.error("permission denied", "signupStudent");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const { email, firstName, lastName, dob, code, promotionId, moy } = data;
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .getOne();
            if (!promotion) {
                common_1.Logger.error("promotion not found", "signupStudent");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
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
            var randomPassword = await new Promise((resolve, reject) => {
                (0, crypto_1.randomBytes)(32, (err, buf) => {
                    if (err)
                        reject(err);
                    resolve(buf.toString('hex'));
                });
            });
            user = this.userRepository.create({ email, password: randomPassword, userType: user_entity_1.UserType.STUDENT });
            user.password = await bcrypt.hash(user.password, 10);
            const student = this.studentRepository.create({ firstName, lastName, dob, code, promotion, moy });
            student.user = user;
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                user = await manager.getRepository(user_entity_1.UserEntity).save(user);
                await manager.getRepository(student_entity_1.StudentEntity).save(student);
            });
            await this.userService._sendNotfication(connectedUser.id, `etudiant: ${student.firstName} ${student.lastName} ajoutés avec success`);
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupStudent");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signupStudents(userId, data) {
        var _a, _b, _c, _d;
        try {
            const manager = (0, typeorm_1.getManager)();
            const connectedUser = await manager.getRepository(user_entity_1.UserEntity).createQueryBuilder('cuser')
                .where('cuser.id = :userId', { userId })
                .getOne();
            if (connectedUser.userType !== user_entity_1.UserType.ADMIN) {
                common_1.Logger.error("permission denied", "signupStudent");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const students = [];
            const users = [];
            for (let key in data) {
                const studentData = data[key];
                console.log("student data", studentData);
                const { email, firstName, lastName, dob, code, promotionId, moy } = studentData;
                const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                    .createQueryBuilder('promotion')
                    .where('promotion.id = :promotionId', { promotionId })
                    .getOne();
                if (!promotion) {
                    common_1.Logger.error("promotion not found", "signupStudentTest");
                    throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
                }
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
                var randomPassword = await new Promise((resolve, reject) => {
                    (0, crypto_1.randomBytes)(32, (err, buf) => {
                        if (err)
                            reject(err);
                        resolve(buf.toString('hex'));
                    });
                });
                user = this.userRepository.create({ email, password: randomPassword, userType: user_entity_1.UserType.STUDENT });
                user.password = await bcrypt.hash(user.password, 10);
                const student = this.studentRepository.create({ firstName, lastName, dob, code, promotion, moy });
                student.user = user;
                users.push(user);
                students.push(student);
            }
            common_1.Logger.log("starting exevuting db save", "AuthService/signupStudents");
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                await manager.getRepository(user_entity_1.UserEntity).save(users);
                await manager.getRepository(student_entity_1.StudentEntity).save(students);
            });
            await this.userService._sendNotfication(connectedUser.id, `${students.length} etudiants sont ajoutés avec success`);
            common_1.Logger.log(students, "AuthService/signupStudents");
            return students;
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupStudents");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signupTeacher(userId, data) {
        var _a, _b, _c, _d;
        try {
            const manager = (0, typeorm_1.getManager)();
            const connectedUser = await manager.getRepository(user_entity_1.UserEntity).createQueryBuilder('cuser')
                .where('cuser.id = :userId', { userId })
                .getOne();
            if (connectedUser.userType !== user_entity_1.UserType.ADMIN) {
                common_1.Logger.error("permission denied", "signupStudent");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const { email, firstName, lastName, ssn, speciality } = data;
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
            var randomPassword = await new Promise((resolve, reject) => {
                (0, crypto_1.randomBytes)(32, (err, buf) => {
                    if (err)
                        reject(err);
                    resolve(buf.toString('hex'));
                });
            });
            user = this.userRepository.create({ email, password: randomPassword, userType: user_entity_1.UserType.TEACHER });
            user.password = await bcrypt.hash(user.password, 10);
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            const teacher = teacherRepository.create({ firstName, lastName, ssn, speciality });
            teacher.user = user;
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                user = await manager.getRepository(user_entity_1.UserEntity).save(user);
                await manager.getRepository(teacher_entity_1.TeacherEntity).save(teacher);
            });
            await this.userService._sendNotfication(connectedUser.id, `ensiegnant ${teacher.id} est ajouté.`);
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupStudent");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signupTeachers(userId, data) {
        var _a, _b, _c, _d;
        try {
            const manager = (0, typeorm_1.getManager)();
            const connectedUser = await manager.getRepository(user_entity_1.UserEntity).createQueryBuilder('cuser')
                .where('cuser.id = :userId', { userId })
                .getOne();
            if (connectedUser.userType !== user_entity_1.UserType.ADMIN) {
                common_1.Logger.error("permission denied", "signupStudent");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const teachers = [];
            const users = [];
            for (let key in data) {
                const teacherData = data[key];
                const { email, firstName, lastName, ssn, speciality } = teacherData;
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
                var randomPassword = await new Promise((resolve, reject) => {
                    (0, crypto_1.randomBytes)(32, (err, buf) => {
                        if (err)
                            reject(err);
                        resolve(buf.toString('hex'));
                    });
                });
                user = this.userRepository.create({ email, password: randomPassword, userType: user_entity_1.UserType.TEACHER });
                user.password = await bcrypt.hash(user.password, 10);
                const teacher = manager.getRepository(teacher_entity_1.TeacherEntity).create({ firstName, lastName, ssn, speciality });
                teacher.user = user;
                users.push(user);
                teachers.push(teacher);
            }
            common_1.Logger.log("starting exevuting db save", "AuthService/signupStudents");
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                await manager.getRepository(user_entity_1.UserEntity).save(users);
                await manager.getRepository(teacher_entity_1.TeacherEntity).save(teachers);
            });
            await this.userService._sendNotfication(connectedUser.id, ` ${teachers.length} ensiegnats sont ajoutés.`);
            common_1.Logger.log(teachers, "AuthService/signupteachers");
            return teachers;
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupteachers");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signupEnterprise(data) {
    }
    async signupAdmin(admin) {
        var _a, _b, _c, _d;
        const { firstName, lastName, password, email } = admin;
        try {
            const manager = (0, typeorm_1.getManager)();
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
            user = this.userRepository.create({ email, password, userType: user_entity_1.UserType.ADMIN });
            user.password = await bcrypt.hash(user.password, 10);
            const adminRepository = manager.getRepository(admin_entity_1.AdminEntity);
            const admin = adminRepository.create({ firstName, lastName });
            admin.user = user;
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                user = await manager.getRepository(user_entity_1.UserEntity).save(user);
                await await manager.getRepository(admin_entity_1.AdminEntity).save(admin);
            });
            return Object.assign(Object.assign({}, admin), { user });
        }
        catch (err) {
            common_1.Logger.log(err, "AuthService/signupAdmin");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
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
            from: '"It experts" <assoulsidali@gmail.com>',
            to: email,
            subject: "Mot de pasee oublié",
            html: `<b>vous avez envoyer une demmande de réinitialisation de mot de passe.</b><br/> presser sur le lien si il s'agit bien de vous </b><br/> le lien:  http://localhost:3000/resetpassword/${token}?uid=${user.id}`,
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
    async signupStudentTest(data) {
        var _a, _b, _c, _d;
        try {
            const manager = (0, typeorm_1.getManager)();
            const { email, password, firstName, lastName, dob, code, promotionId, moy } = data;
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .getOne();
            if (!promotion) {
                common_1.Logger.error("promotion not found", "signupStudentTest");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
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
            const student = this.studentRepository.create({ firstName, lastName, dob, code, promotion, moy });
            student.user = user;
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                user = await manager.getRepository(user_entity_1.UserEntity).save(user);
                await manager.getRepository(student_entity_1.StudentEntity).save(student);
            });
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupStudent");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signupTeacherTest(data) {
        var _a, _b, _c, _d;
        try {
            const manager = (0, typeorm_1.getManager)();
            const { email, firstName, lastName, ssn, speciality, password } = data;
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
            user = this.userRepository.create({ email, password, userType: user_entity_1.UserType.TEACHER });
            user.password = await bcrypt.hash(user.password, 10);
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            const teacher = teacherRepository.create({ firstName, lastName, ssn, speciality });
            teacher.user = user;
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                user = await manager.getRepository(user_entity_1.UserEntity).save(user);
                await manager.getRepository(teacher_entity_1.TeacherEntity).save(teacher);
            });
        }
        catch (err) {
            common_1.Logger.error(err, "AuthService/signupStudent");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        student_repository_1.StudentRepository,
        reset_password_token_repository_1.RestPasswordTokenRepository,
        jwt_1.JwtService,
        socket_service_1.SocketService,
        user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map