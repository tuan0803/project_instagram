import { DataTypes } from 'sequelize';

const UserEntity = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, 
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
              msg: 'Email cannot be empty,',
            },
            notEmpty: {
              msg: 'Email cannot be empty,',
            },
            isEmail: {
              msg: 'Email is not in correct format.',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100],
            // is: {
            //     args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            //     msg: 'Password is not in correct format.',
            // },
        },
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.NUMBER,
        allowNull: true,
        unique: true,
        validate: {
            isNumeric: true,
        },
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        field: 'created_at',
    },
    updated_at: {
        type: DataTypes.DATE,
        field: 'updated_at',
    },
};

export default UserEntity;