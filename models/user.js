'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // defnpx sequelize-cli db:migrateine association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    virfied: {
      type: DataTypes.BOOLEAN,  
      allowNull: false,         
      defaultValue: false,     
    },
    imagePath: {
      type: DataTypes.STRING,  
      allowNull: true,         
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};