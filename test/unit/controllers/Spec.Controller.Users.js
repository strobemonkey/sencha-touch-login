describe("Config controller", function() {
    
    var controller = Ext.ControllerManager.get("Config");

    it("should have config store", function() {
        expect(controller.store).toEqual(App.stores.config);
    });

    describe("index action", function() {
        beforeEach(function() {
            
        });
        
        it("should reveal the main view", function() {
            // var myStub = jasmine.createSpy('App.views.viewport');  // can be used anywhere
            spyOn(controller, 'index');
            controller.index();
            // expect(myStub).toHaveBeenCalled();
            
            // expect(pie.doneBaking()).toBeTruthy();
            
        });
        
    });

    describe("editForm action", function() {
        beforeEach(function() {
            
        });
    });

    describe("save action", function() {
        beforeEach(function() {
          
        });
    });

    describe("update action", function() {
        beforeEach(function() {
          
        });
    });

});
