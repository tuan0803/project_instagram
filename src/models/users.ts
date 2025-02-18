import { Model, Sequelize, ModelValidateOptions, ModelScopeOptions, Op, ValidationErrorItem } from 'sequelize';
import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import Settings from '@configs/settings';
import MailActive from '@services/mailer';
import fs from 'fs';
import CommentModel from './comments';
import CommentTagModel from './commentTags';

class UserModel extends Model<UserInterface> implements UserInterface {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public currentPassword?: string;
    public passwordConfirmation?: string;
    public bio: string;
    public phoneNumber: number;
    public avatarUrl: string;
    public isPrivate: boolean;
    public isActive: boolean;
    public verificationCode: string;
    public verificationCodeExpiry: Date;
    public firstLoginDate: Date;
    public createdAt: Date;
    public updatedAt: Date;

    static readonly CREATABLE_PARAMETERS = ['email', 'password', 'name', 'passwordConfirmation'];
    static readonly UPDATABLE_PARAMETERS = ['name', 'bio', 'avatar_url', 'phone_number'];

    static readonly hooks: Partial<ModelHooks<UserModel>> = {
        async beforeSave(record) {
            if (record.password && record.password !== record.previous('password')) {
                const salt = bcrypt.genSaltSync();
                record.password = bcrypt.hashSync(record.password, salt);
            }
        },
        async afterCreate(record) {
            record.sendMailActive();
        },
        async beforeUpdate(record, options) {
            if (record.changed('password')) {
                options.validate = false;
            }
        },
    };

    static readonly scopes: ModelScopeOptions = {
        byId(id) {
            return {
                where: { id },
            };
        },
        byEmail(email) {
            return {
                where: { email },
            };
        },
        byName(name) {
            return {
                where: {
                    name: {
                        [Op.like]: `%${name}%`,
                    },
                },
            };
        },
        byVerificationCode(code) {
            return {
                where: {
                    verificationCode: code,
                    verificationCodeExpiry: {
                        [Op.gt]: new Date(),
                    },
                },
            };
        },
    };

    static readonly validations: ModelValidateOptions = {
        isValidEmail() {
            if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                throw new ValidationErrorItem('Invalid email format', 'Validation error', 'email', this.email);
            }
        },
        async isEmailUnique() {
            if (this.email) {
                const existedEmail = await UserModel.findOne({ where: { email: this.email } });
                if (existedEmail && existedEmail.id !== this.id) {
                    throw new ValidationErrorItem('Email already exists!', 'Unique constraint', 'email', this.email);
                }
            }
        },
        async verifyMatchPassword() {
            if (!this.passwordConfirmation) return;
            if (this.password !== this.passwordConfirmation) {
                throw new ValidationErrorItem('Password confirmation does not match.', 'Validation error', 'passwordConfirmation', this.passwordConfirmation);
            }
        },
        async verifyNewPassword() {
            if (!this.currentPassword) return;
            if (this.currentPassword === this.password) {
                throw new ValidationErrorItem('New password must not be the same as the current password.', 'Validation error', 'password', this.password);
            }
        },
    };

    public static async generateVerificationCode(): Promise<string> {
        let code = '';
        const codeLength = 32;
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        const existedRecord = await UserModel.findOne({
            attributes: ['verificationCode'],
            where: { verificationCode: code },
        });
        if (existedRecord) return UserModel.generateVerificationCode();
        return code;
    }

    public async sendMailActive() {
        const verificationCode = await UserModel.generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
        const { email } = this;
        await UserModel.update(
            { verificationCode, verificationCodeExpiry },
            { where: { email } }
        );

        const activationLink = `${Settings.frontendUrl}/active/verify?code=${verificationCode}`;
        await MailActive(
            email,
            'Account Activation',
            `<p>Please activate your account: ${this.name}</p><a href="${activationLink}">${activationLink}</a>`
        );
    }

    public async generateToken(existingRefreshExp?: number) {
        const accessToken = jwt.sign(
            {
                id: this.id,
            },
            Settings.jwtSecret,
            { expiresIn: Settings.access_ttl }
        );
        const refreshToken = jwt.sign(
            { id: this.id },
            Settings.jwtRefreshSecret,
            { expiresIn: existingRefreshExp ? Math.floor(existingRefreshExp - Date.now() / 1000) : Settings.refresh_ttl }
        );

        return { accessToken, refreshToken };
    }

    public async validPassword(password: string) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            return false;
        }
    }

    public static initialize(sequelize: Sequelize) {
        this.init(UserEntity, {
            hooks: UserModel.hooks,
            scopes: UserModel.scopes,
            validate: UserModel.validations,
            sequelize,
            tableName: 'users',
            modelName: 'user',
            timestamps: true
        });
    }

    public static associate() {
        this.hasMany(CommentTagModel, { foreignKey: 'userId' });
    }

    public toJSON() {
        const { password, verificationCode, passwordConfirmation, verificationCodeExpiry, firstLoginDate, ...values } = this.get();
        return values;
    }
}

export default UserModel;
