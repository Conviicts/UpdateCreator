const fsp = require('fs').promises;
const path = require('path');

async function* scan3(dir) {
	const entries = await fsp.readdir(dir, { withFileTypes: true });
	for (const de of entries) {
		const res = path.resolve(dir, de.name);
		if (de.isDirectory())
			yield* scan3(res);
		else
			yield res;
	}
}

async function* filterExt(it, ext) {
    for await (const e of it) {
		if (ext == '*')
			yield e;
		else if (e.endsWith(ext))
			yield e;
    }
}

exports.scan = scan3;
exports.filter = filterExt;
