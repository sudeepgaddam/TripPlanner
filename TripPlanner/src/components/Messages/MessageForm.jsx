import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MessageForm extends Component{
	render(){
		return(
			<div>
				<form onSubmit={this.onSubmit.bind(this)} onChange={this.onChange.bind(this)} >
					<input type="text" className="form-control" ref="text" placeholder="Please type a message..." />
				</form>
			</div>
		)
	}

	onSubmit(e){
		e.preventDefault();

		this.props.emit('messageAdded', {
			timeStamp: Date.now(),
			text: this.refs.text.value.trim(),
			user: this.props.user.name
		});

		// Clear Form
		this.refs.text.value = '';
	}


	onChange(e){

		this.props.emit('messageTyping', {
			timeStamp: Date.now(),
			text: this.refs.text.value.trim(),
			user: this.props.user.name
		});
	}
}

export default MessageForm
