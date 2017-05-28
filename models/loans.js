'use strict';

module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patron_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Loaned-on date is required"
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Return-by date is required"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Returned-on date is required"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'});
        Loans.belongsTo(models.Books, {foreignKey: 'book_id'});
      }
    },
    timestamps: false
  });
  return Loans;
};