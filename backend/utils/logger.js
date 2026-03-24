const Log = require('../models/Log');

exports.createLog = async (data) => {
  try {
    await Log.create(data);
  } catch (err) {
    console.error('Audit Log Error:', err.message);
  }
};
