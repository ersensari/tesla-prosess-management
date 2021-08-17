const db = require('../index');
const { Op } = require('sequelize');
const moment = require('moment');
module.exports = {
  queries: {
    findAll: async (criteria) => {
      let endDate =
        criteria.beginDate === criteria.endDate
          ? moment(criteria.beginDate).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm')
          : criteria.endDate;

      const whereClause = {
        where: {
          productionDate:
            criteria && criteria.beginDate
              ? {
                  [Op.between]: [
                    new Date(moment(criteria.beginDate).format('YYYY-MM-DD HH:mm')),
                    new Date(moment(endDate).format('YYYY-MM-DD HH:mm')),
                  ],
                }
              : {
                  [Op.gte]: new Date(moment().add(-1, 'weeks').format('YYYY-MM-DD HH:mm')),
                },
        },
      };
      const result = await db.Production.findAll({
        ...whereClause,
        order: [
          ['productionDate', 'DESC'],
          ['createdAt', 'DESC'],
        ],
        include: [
          'StartedUser',
          {
            model: db.ProductionFormula,
            as: 'Details',
            include: [
              {
                model: db.Silo,
                include: ['RawMaterial'],
              },
              'RawMaterial',
            ],
          },
          {
            model: db.ProductionGroup,
            as: 'Groups',
            include: [
              'StartedUser',
              'DosingGroup',
              {
                model: db.ProductionDetail,
                as: 'Details',
                include: ['Silo', 'RawMaterial'],
              },
            ],
          },
        ],
      });

      return result;
    },
    findByPk: async (id) => {
      return await db.Production.findByPk(id, {
        include: [
          'StartedUser',
          {
            model: db.ProductionGroup,
            as: 'Groups',
            include: [
              'StartedUser',
              {
                model: db.DosingGroup,
              },
              {
                model: db.ProductionDetail,
                as: 'Details',
                include: [
                  {
                    model: db.Silo,
                    include: ['RawMaterial'],
                  },
                  'RawMaterial',
                ],
              },
            ],
          },
          {
            model: db.ProductionFormula,
            as: 'Details',
            include: ['Silo', 'RawMaterial'],
          },
        ],
      });
    },
    getActiveOrder: async () => {
      return await db.Production.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
        where: {
          startedAt: {
            [Op.ne]: null,
          },
          finishedAt: {
            [Op.is]: null,
          },
        },
        include: [
          {
            model: db.ProductionGroup,
            as: 'Groups',
            include: [
              {
                model: db.DosingGroup,
              },
              {
                model: db.ProductionDetail,
                as: 'Details',
                include: [
                  {
                    model: db.Silo,
                    include: ['RawMaterial'],
                  },
                  'RawMaterial',
                ],
              },
            ],
          },
          {
            model: db.ProductionFormula,
            as: 'Details',
            include: ['Silo', 'RawMaterial'],
          },
        ],
      }).then((items) => {
        if (items.length > 0) {
          return items[0];
        } else {
          return null;
        }
      });
    },
    getSelectedOrder: async () => {
      return await db.Production.findOne({ where: { selected: true } });
    },
  },

  mutations: {
    save: async (payload) => {
      return await db.Production.create(payload, {
        include: [
          {
            model: db.ProductionFormula,
            as: 'Details',
          },
        ],
      }).catch((err) => console.log(err));
    },
    update: async (payload) => {
      await db.Production.update(payload, {
        where: { id: payload.id },
      }).catch((err) => {
        console.log(err);
      });
    },

    selectOrder: async (id) => {
      db.sequelize
        .query('UPDATE productions SET selected=0 WHERE id != ' + id)
        .then(() => {
          db.sequelize.query('UPDATE productions SET selected=1 WHERE id = ' + id).catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    delete: async (id) => {
      await db.Production.destroy({ where: { id: id } });
    },
  },
};
