//Task component represents a single to do item
Task = React.createClass({

	propTypes: {
		//this component gets the task to display through a React prop
		//we can use propTypes to indicate it is required
		task: React.PropTypes.object.isRequired,
    	showPrivateButton: React.PropTypes.bool.isRequired
	},

	toggleChecked(){
		// set the checked property to the opposite of its current value
		//(method that will be called, the user that will be updated, the value that will be set)
		Meteor.call("setChecked", this.props.task._id, ! this.props.task.checked);

	},

	deleteThisTask(){
		//remove the task
		Meteor.call('removeTask', this.props.task._id);
	},

	togglePrivate(){
		Meteor.call('setPrivate', this.props.task._id, ! this.props.task.private);
	},

	render(){

		// give tasks a different className when checked off so it can be styled differently in the css
    	// Add "checked" and/or "private" to the className when needed
		const taskClassName = (this.props.task.checked ? "checked" : "") + " " + (this.props.task.private ? "private" : "");

		return(
			 <li className={taskClassName}>
		        <button className="delete" onClick={this.deleteThisTask}>
		          &times;
		        </button>
		 
		        <input
		          type="checkbox"
		          readOnly={true}
		          checked={this.props.task.checked}
		          onClick={this.toggleChecked} />
					
		          	{ this.props.showPrivateButton ? (
			          <button className="toggle-private" onClick={this.togglePrivate}>
			            { this.props.task.private ? "Private" : "Public" }
			          </button>) : ''}

		 
		        <span className="text">
		          <strong>{this.props.task.username}</strong>: {this.props.task.text}
		        </span>
		      </li>
		);
	}
});