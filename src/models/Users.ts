import { Model, Sequelize, ModelValidateOptions, ModelScopeOptions, Op } from 'sequelize';
import UserEntity from '@entities/user';
import UserInterface from '@interfaces/user';
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
    public phone_number: number;
    public avatar_url: string;
    public is_private: boolean;
    public created_at: Date;
    public updated_at: Date;

    static readonly CREATABLE_PARAMETERS = ['email', 'password', 'name'];
    static readonly UPDATABLE_PARAMETERS = ['name', 'bio', 'avatar_url'];

    static readonly hooks: Partial<ModelHooks<UserModel>> = {
        async beforeSave(record) {
            if (record.email) {
                const existedEmail = await UserModel.findOne({ where: { email: record.email } });
                if (existedEmail && existedEmail.id !== record.id) {
                    throw new Error('Email already exists!');
                }
            }

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
    };

    public static async findByEmail(email: string) {
        return await this.findOne({ where: { email } });
    };

    public static async findById(id: number) {
        return await this.findOne({ where: { id } });
    };

    public toJSON() {
        const values = { ...this.get() };
        delete values.password; 
        return values;
    }

    public static generate(user: UserModel) {
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
                userId: user.id,
                userEmail: user.email
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
