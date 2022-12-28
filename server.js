'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const TOKEN = process.env.LINE_ACCESS_TOKEN;
const apikey = process.env.ALPHA_VANTAGE_API_KEY;

const axios = require('axios');
const cron = require('node-cron');
const qs = require('query-string');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const roundFloat = (number, digit) => {
  return Math.round(number * Math.pow(10, digit)) / Math.pow(10, digit);
};

const fetchStockData = async symbol => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${apikey}`;

  const data = await axios({
    method: 'get',
    url,
    json: true,
    headers: { 'User-Agent': 'request' },
  })
    .then(response => {
      if (response.data.hasOwnProperty('Error Message')) {
        return {
          status: 'err',
          data: { errorMessage: response.data['Error Message'] },
        };
      }

      const values = Object.values(response.data['Weekly Time Series']);
      const thisWeek = parseFloat(values[0]['4. close']);
      const lastWeek = parseFloat(values[1]['4. close']);
      const rate = roundFloat((thisWeek / lastWeek - 1) * 100, 2);

      return {
        status: 'ok',
        data: {
          symbol,
          rate: rate >= 0 ? `+${rate}` : String(rate),
          thisWeek: String(thisWeek),
          lastWeek: String(lastWeek),
        },
      };
    })
    .catch(e => {
      return {
        status: 'err',
        data: { errorMessage: e.message },
      };
    });

  return new Promise((resolve, reject) => {
    if (data.status === 'ok') {
      resolve(data);
    }
    reject(data);
  });
};

const contentToText = content => {
  return `
    銘柄: ${content.data.symbol}
    週騰落率: ${content.data.rate}%
    今週終値: ${content.data.thisWeek}
    先週終値: ${content.data.lastWeek}`;
};

const postText = text => {
  axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${TOKEN}`,
    },
    data: qs.stringify({
      message: text,
    }),
  }).catch(e => console.error(e));
};

const main = async symbol => {
  const content = await fetchStockData(symbol);
  const text = contentToText(content);
  postText(text);
};

postText('テスト配信');
main('QQQ');

cron.schedule(
  '0 9 * * Saturday',
  async () => {
    try {
      const symbol = 'QQQ';
      main(symbol);
    } catch (e) {
      console.error(e);
    }
  },
  {
    timezone: 'Asia/Tokyo',
  }
);

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`app running`);
});
