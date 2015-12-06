AccountsUIWrapper = React.createClass({
	
	componentDidMount(){
		//use meteor blaze to render login buttons
		this.view = Blaze.render(Template.loginButtons, React.findDOMNode(this.refs.container));
 		
	},

	componentWillUnmount(){
		// clean up blaze view
 		Blaze.remove(this.view);
	},

	render(){
		return <span ref="container" />;
	}
});