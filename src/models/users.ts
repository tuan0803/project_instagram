import { Model, Sequelize, ModelValidateOptions, ModelScopeOptions, Op } from 'sequelize';
import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import Settings from '@configs/settings';

class UserModel extends Model<UserInterface> implements UserInterface {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public bio: string;
    public phoneNumber: number;
    public avatarUrl: string;
    public isPrivate: boolean;
    public isActive: boolean;
    public firstLoginDate: Date;
    public createdAt: Date;
    public updatedAt: Date;

    static readonly CREATABLE_PARAMETERS = ['email', 'password', 'name'];
    static readonly UPDATABLE_PARAMETERS = ['name', 'bio', 'avatar_url'];

    static readonly hooks: Partial<ModelHooks<UserModel>> = {
        async beforeSave(record) {
            if (record.password && record.password !== record.previous('password')) {
                const salt = bcrypt.genSaltSync();
                record.password = bcrypt.hashSync(record.password, salt);
            }
        },
    };

    static readonly scopes: ModelScopeOptions = {
        byId (id) {
            return {
                where: { id }
            }
        },
        byEmail (email) {
            return {
                where: { email }
            }
        },
        byName (name) {
            return {
                where: {
                    name: {
                        [Op.like]: `%${name}%`, 
                    },
                },
            }
        }

    }

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
    };

    public toJSON() {
        const values = { ...this.get() };
        delete values.password; 
        return values;
    }

    public static generateAccessToken(user: UserModel) {
        const accessToken = jwt.sign(
            { 
                userId: user.id,
                userEmail: user.email
            },
            Settings.jwtSecret,
            { expiresIn: Settings.access_ttl }
        );

        const refreshToken = jwt.sign(
            { 
                id: user.id,
                email: user.email
            },
            Settings.jwtRefreshSecret,
            { expiresIn: Settings.refresh_ttl }
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

    public static initialize (sequelize: Sequelize) {
        this.init( UserEntity, {
            hooks: UserModel.hooks,
            scopes: UserModel.scopes,
            validate: UserModel.validations,
            sequelize,
            tableName: 'users',
            modelName: 'user',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            
        })
    }

    public static associate() {
       
    }

}

export default UserModel;
