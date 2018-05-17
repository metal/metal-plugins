const ngrok = require('ngrok');
const log = console.log;
const chalk = require('chalk');

async function run() {
	let url = await ngrok
		.connect({
			proto: 'http',
			addr: 9876,
		})
		.then(res => {
			log(
				chalk.bold(
					'Acess the following url in Google Chrome of our mobile device to run tests:'
				)
			);
			log(chalk.bold.magenta(res));
		});
}

run();
