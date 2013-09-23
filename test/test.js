var path		 = require('path')
,	 mongoose = require('mongoose')
,	 slugger	 = require(path.join(__dirname, '../lib/index'))
,	 expect	 = require('chai').expect;

mongoose.connect('mongodb://localhost:27017/mongoose_slugger');

describe('Model', function () {	
	describe('Schema', function () {
		before(function (done) {
			var AccountSchema = new mongoose.Schema();
			AccountSchema.plugin(slugger);
			this.model = mongoose.model('Account Schema', AccountSchema);
			done();
		});
		
		it('should store slug', function () {
			expect(this.model.schema).to.have.deep.property('paths.slug')
		});
	});
	
	describe('Defaults', function () {		
		before(function (done) {
			var AccountDefault = new mongoose.Schema();
			AccountDefault.plugin(slugger);
			this.model = mongoose.model('Account Default', AccountDefault);
			done();
		});
		
		it('should auto-populate slug with id if unmodified', function (done) {
			var account = new this.model();
			account.save(function (err) {
				expect(account.slug).to.equal(account.id);
				done()
			})
		});
		
		it('should store slug if provided', function (done) {
			var account = new this.model({ slug: 'test' });
			account.save(function (err) {
				expect(account.slug).to.equal('test');
				done()
			})
		})
	});
	
	describe('Options', function () {
		before(function (done) {
			var AccountOptions = new mongoose.Schema({
				title: String
			});
			AccountOptions.plugin(slugger, { source: 'title' });
			this.model = mongoose.model('Account Options', AccountOptions);
			done();
		});
		it('should accept and use options.source', function (done) {
			var account = new this.model({ title: 'Flintstones' });
			account.save(function (err) {
				expect(account.slug).to.equal('flintstones');
				done()
			})
		})
	})
})