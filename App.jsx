//App component represents the entire app
App = React.createClass({
	
	//this mixin will allow the getMeteorData method to work 
	//this is how the application will handle data
	mixins: [ReactMeteorData],

	//all instance variables should be defined here
	//think of this as a constructor function
	getInitialState(){
		return {
			hideCompleted: false
		}
	},

	//allows the application to access reactive data
	getMeteorData(){
		
		let query = {};

		if(this.state.hideCompleted){
			//query for all documents with checked not equal to true.
			query = { checked: { $ne: true } };
		}

		//data sources from Mongo (accessible by this.data...)
		return {
			tasks: Tasks.find(query, { sort: { createdAt: -1 } }).fetch(),
			incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
			currentUser: Meteor.user()
		};
	},
	
	//the actual individual task that will be rendered
	renderTasks(){

		// return each task from this.data.tasks
		return this.data.tasks.map((task) => {
			const currentUserId = this.data.currentUser && this.data.currentUser._id;
      		const showPrivateButton = task.owner === currentUserId;
			return <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />;
		});
	},

	handleSubmit(event){
		event.preventDefault();

		// find the textfield via the react ref
		var text = React.findDOMNode(this.refs.textInput).value.trim();

		//make the call to add task on Meteor.methods in simple-todos-react.jsx
		Meteor.call("addTask", text);

		//clear form;
		React.findDOMNode(this.refs.textInput).value = "";
	},

	// simple toggle that sets the 'hideCompleted' to the opposite of what it is currently
	toggleHideCompleted() {
	    this.setState({
	      hideCompleted: ! this.state.hideCompleted
	    });
	 },

	 //render the actual application
	render(){

		return(

			<div className="container">
		        <header>
		          <h1>Todo List ({this.data.incompleteCount})</h1>

		          <label className="hide-completed">
		            <input
		              type="checkbox"
		              readOnly={true}
		              checked={this.state.hideCompleted}
		              onClick={this.toggleHideCompleted} />
		            Hide Completed Tasks
		          </label>
					
		          <AccountsUIWrapper />

		          {
		          	this.data.currentUser ? 
		          	<form className="new-task" onSubmit={this.handleSubmit} >
		              <input
		                type="text"
		                ref="textInput"
		                placeholder="Type to add new tasks" />
		            </form> : 'No Logged In User'
		          }

		        </header>
		 
		        <ul>
		          { this.renderTasks() }
		        </ul>
			</div>
		)
	}
});

