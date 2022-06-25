# QQQ-weekly-line-notify

This project is an application notifying the stock price(this week & last week) of Invesco QQQ Trust Series 1(ticker symbol: QQQ) and the weekly rate of increase/decrease.

## Using this project

1. Clone the repository and switch to the directory.

~~~
git clone https://github.com/kwkmts/QQQ-weekly-line-notify.git
~~~

~~~
cd QQQ-weekly-line-notify
~~~

2. Install dependencies.

~~~
npm install
~~~

3. Access the site below and login with your LINE account. Then, get your own access token of LINE Notify.

https://notify-bot.line.me/my/

4. Get your own API key of Alpha Vantage from the site below.

https://www.alphavantage.co/support/#api-key

5. Create `.env` file in the directory with the command `touch .env`, and then edit `.env` as below.

~~~
LINE_ACCESS_TOKEN=<your LINE access token>
ALPHA_VANTAGE_API_KEY=<your Alpha Vantage API key>
~~~


6. Run the application.

~~~
npm run dev
~~~

7. (option) You can change the cron setting in `server.js`(L.90)(Refer to the site below).

https://www.npmjs.com/package/node-cron

8. (option) You can use the ticker symbol which you like instead of 'QQQ'(`server.js`(L.92)).
