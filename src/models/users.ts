import { Model, Sequelize, ModelValidateOptions, ModelScopeOptions, Op } from 'sequelize';
import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import Settings from '@configs/settings';
import MailActive from '@services/mailer';
import fs from 'fs';

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
            if(record.changed('password')){
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
                throw new Error('Invalid email format!');
            }
        },
        async isEmailUnique() {
            if (this.email) {
                const existedEmail = await UserModel.findOne({ where: { email: this.email } });
                if (existedEmail && existedEmail.id !== this.id) {
                    throw new Error('Email already exists!');
                }
            }
        },
        async verifyMatchPassword() {
            if (!this.passwordConfirmation) return;
            if (this.password !== this.passwordConfirmation) {
                throw new Error('Password confirmation is not matched.');
            }
        },        
        async verifyNewPassword() {
            if (!this.currentPassword) return;
            if (this.currentPassword === this.password) {
              throw new Error('New password must not be the same as current password.');
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
                userId: this.id,
                userEmail: this.email,
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
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }

    public static associate() {
       
    }

    public toJSON() {
        const values = { ...this.get() };
        delete values.password;
        delete values.verificationCode;  
        delete values.passwordConfirmation;   
        return values;
    }
}

export default UserModel;
