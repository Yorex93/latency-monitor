# Latency Monitor

Application for monitoring latency across services. The Application works by making requests to the services at set intervals and keeping records of all the timing phases involved in the request.

## Installation
Clone the package into your local computer with.

```bash
git clone https://github.com/Yorex93/latency-monitor.git
cd latency-monitor
npm install
```

## Usage
rename env.example to .env and input your own variables.

Then run
```bash
npm run start
```
or
```bash 
npm run monitor
```
to use pm2 monitoring

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)