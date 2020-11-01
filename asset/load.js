const loadPost = require('../request/post_body');
const sessions = require('../data/sessions');
const asset = require('./main');

module.exports = function (req, res, url) {
	switch (req.method) {
		case 'GET':
			const match = req.url.match(/\/assets\/([^/]+)\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			const mId = match[1], aId = match[2];
			const b = asset.load(mId, aId);
			b ? (res.statusCode = 200, res.end(v)) :
				(res.statusCode = 404, res.end(e));
			return true;

		case 'POST':
			if (url.path != '/goapi/getAsset/' && url.path != '/goapi/getAssetEx/') return;
			loadPost(req, res).then(data => {
				const mId = data.movieId || data.presaveId || sessions.get(req);
				const aId = data.assetId || data.enc_asset_id;

				const b = asset.load(mId, aId);
				sessions.set({ movieId: mId }, req);
				b ? res.end(b) : (res.statusCode = 404, res.end());
			});
			return true;
	}
}