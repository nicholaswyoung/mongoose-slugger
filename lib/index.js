module.exports = function(schema, options) {
	var StrExt = require('string');
	
	options = options || {};
	
	schema.add({
		slug: { type: String, unique: true }
	});
	
	schema.pre('save', function (next) {
		if (this.isModified('slug')) return next();
		if (options.source) {
			this.slug = StrExt(this[options.source]).slugify().s;
		} else {
			this.slug = StrExt(this.id).slugify().s;
		}
		next();
	});
};