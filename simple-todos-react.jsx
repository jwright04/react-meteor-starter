//define a collection to hold tasks
Tasks = new Mongo.Collection('tasks');

//client side functionality
if (Meteor.isClient) {

	//tell AccountsUIWrapper element which fields to display
	// http://docs.meteor.com/#/full/accounts_ui_config 
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
	
    //the server will have access to the specfic tasks that were pubslished on the server
    Meteor.subscribe("tasks");
    

    //Meteor.startup renders the component after the page is ready
    Meteor.startup(function() {

        React.render( < App / > , document.getElementById("render-target"));
    });
}

//server side functionality
if (Meteor.isServer) {
	
	// Only publish to the client the tasks that are public or belong to the current user
	Meteor.publish("tasks", function() {
		return Tasks.find({$or: [{ private: {$ne: true} },{ owner: this.userId }]});
	});
}

//all of the methods will be accessed via Meteor.call...
Meteor.methods({
    addTask(text) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Tasks.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    removeTask(taskId) {
    	const task = Tasks.findOne(taskId);
	    if (task.private && task.owner !== Meteor.userId()) {
	      // If the task is private, make sure only the owner can delete it
	      throw new Meteor.Error("not-authorized");
	    }
        Tasks.remove(taskId);
    },

    setChecked(taskId, setChecked) {
        const task = Tasks.findOne(taskId);
	    if (task.private && task.owner !== Meteor.userId()) {
	      // If the task is private, make sure only the owner can check it off
	      throw new Meteor.Error("not-authorized");
	    }
        Tasks.update(taskId, {
            $set: {
                checked: setChecked
            }
        });
    },

    setPrivate(taskId, setToPrivate) {

        const task = Tasks.findOne(taskId);

        // Make sure only the task owner can make a task private
        if (task.owner !== Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Tasks.update(taskId, {
            $set: {
                private: setToPrivate
            }
        });
    }
});


