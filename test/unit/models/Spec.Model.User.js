describe("Config", function() {

    var Config = Ext.ModelMgr.getModel("Config"),
        instance;
    
    beforeEach(function() {
      instance = new Config({});
    });
  
    describe("server field", function() {

        it("should only allow a valid url", function() {
            instance.set('server', 'http://123');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('server')).toEqual([]);
            expect(instance.get('server')).toEqual('http://123');
        });
        
        it("should not allow an invalid url", function() {
            instance.set('server', 'guff');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('server')).toEqual([{field: 'server', message: 'must be a valid url'}]);
        });
        
    });

    describe("key field", function() {
        
        it("should only allow 6 or more characters", function() {
            instance.set('key', '123456');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('key')).toEqual([]);
            expect(instance.get('key')).toEqual('123456');
        });
        
        it("should not allow less than 6 characters", function() {
            instance.set('key', '12345');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('key')).toEqual([{field: 'key', message: 'must be at least 6 characters'}]);
        });
        
    });

    describe("nickname field", function() {
        
        it("should not allow non-alphanumeric characters", function() {
            instance.set('nickname', '*&^%$');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('nickname')).toEqual([{field: 'nickname', message: 'must only contain characters and numbers'}]);
        });
        
    });

    describe("email field", function() {
        
        it("should not allow non-email like value", function() {
            instance.set('email', 'whee');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('email')).toEqual([{field: 'email', message: 'must be a valid email'}]);
        });

    });

    describe("messaging field", function() {

        it("should only allow one of selected values", function() {
            instance.set('messaging', 'asynchronous');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('messaging')).toEqual([]);
            expect(instance.get('messaging')).toEqual('asynchronous');
        });
        
        it("should not allow a value that is not one of the allowed values", function() {
            instance.set('messaging', 'whee');
            var errors = instance.validate();
            expect(errors.isValid()).toEqual(false);
            expect(errors.getByField('messaging')).toEqual([{field: 'messaging', message: 'must be either polling, asynchronous or off'}]);
        });
        
    });

    describe("timerInterval field", function() {
        // no tests yet
    });

    describe("gravatar method", function() {

        it("should create a hash for gravatar from email", function() {
            instance.set('email', 'poo@plop.com');
            instance.updateGravatar();
            expect(instance.get('gravatar')).toEqual('30eb8b2ba07517c0379b86b29e3aa284');
        });
        
    });
    
  
});