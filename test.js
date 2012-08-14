/*global atom:true, gravity:true, logger:true, process, require*/
atom = typeof atom === 'undefined' ? require('./atom/atom') : atom;
gravity = typeof gravity === 'undefined' ? require('./gravity.js') : gravity;
logger = (typeof logger !== 'undefined' && logger) || console.log;

var
	inBrowser = typeof document !== 'undefined',
	inNode = !inBrowser,
	argv = inNode && process.argv,
	arg2 = argv && argv.length > 2 && argv[2],
	verbose = inBrowser || arg2 === '-v',
	a = atom.create(),
	results = [],
	totals = { success: 0, fail: 0, total: 0 }
;

logger('Testing: gravity ' + gravity.VERSION);

function assert(msg, success) {
	totals.total++;
	if (success) {
		totals.success++;
		if (verbose) {
			logger(msg + '... success.');
		}
	} else {
		totals.fail++;
		logger(msg + '... FAIL!');
	}
}

assert('gravity.pull() is a function', typeof gravity.pull === 'function');

a.chain(function (next) {
	var base = '/Users/ccampbell/Dropbox/gravity/test/proj-1/src';
	gravity.list(base + '/gravity.map', base, function (list) {
		console.log(list);
		assert('Thers 2 things!', list.length === 2);
		next();
	});
});

a.chain(function () {
	logger(totals);
});
