const moment = require('moment');
const axios = require('axios');

const record = (email, password, type) => {
  axios.post(
    'https://api.commonspace.ai/work/rec_location/',
    {
      loc_lon: 0,
      loc_lat: 0,
      loc_point_id: 1,
      loc_check_type: type, // 'OUT',
      wk_modified_time: moment().format(),
    },
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json;charset=UTF-8',
        Authorization: `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`,
      },
    },
  ).then((res) => {
    console.log(res.data);
  });
};

record('sknah@urbanbase.com', 'sangkwon@79', 'IN');
