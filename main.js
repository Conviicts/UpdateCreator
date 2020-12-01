const fs = require('fs');
const hasha = require('hasha');
const files = require('./utils/files');
const colors = require('colors');
const argv = process.argv;

process.on('exit', (code) => {
	switch(code)
	{
		case 0:
			return console.log(`process successfully ended.`.green);
		case 22:
			return console.log(`exit with code ${code}`.red);
		default:
			return console.log(`unknown exit code: ${code}`.bgYellow.red);
	}
});

async function main() {
	var array = [];
	var i = 0;
	const _files = files.scan(argv[3]);
	const _mdFiles = files.filter(_files, '*');
	
	console.log("Processing files...".green);
	for await (const f of _mdFiles) {
		const name = f.split(argv[4])[1];
		const hash = hasha.fromFileSync(f, { algorithm: 'sha1'});
		const data = {name, hash};
		array.push(data);
		i++;
	}
	if (fs.existsSync(`${argv[2]}.json`))
		fs.unlinkSync(`${argv[2]}.json`);
	fs.writeFile(`output/${argv[2]}.json`, JSON.stringify(array, null, 4), (err) => {
		if (err) console.log(`${err}`.red);
		console.log(`${i} files have been processed`.green);
		console.log(`output: ./output/${argv[2]}.json`);
	});
}
if (argv[2] && argv[3] && argv[4]) {
	console.log("Starting process...".green);
	main();
}
else {
	argv.splice(0, 2);
	if (!argv[0])
		console.log(`Missing version arg`.yellow);
	if (!argv[1])
		console.log(`Missing path arg`.yellow);
	if (!argv[2])
		console.log(`Missing split arg`.yellow);
	process.exit(22);
}
