'use strict';

module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('Patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First name is required"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last name is required"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Address is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email address is required"
        },
        isEmail: {
          msg: "Email you entered is invalid. Please enter a valid email"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Library ID is required"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Zip Code is required"
        },
        isNumeric: {
          msg: "Zip Code must be numbers"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'});
      }
    },
    timestamps: false
  });
  return Patrons;
};