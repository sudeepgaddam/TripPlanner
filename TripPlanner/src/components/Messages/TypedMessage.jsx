import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Message from './Message.jsx';

class TypedMessage extends Component{
	render(){
		return(this.formatMessage());
	}



	formatMessage(){
		if(!this.props.typedMessage.user) {
		return(
			null
		)
		} else {
			return (
				<div className="well">
					{
								<strong> {this.props.typedMessage.user} is typing {this.props.typedMessage.text} .....</strong>
					}
				</div>
			)
		}
	}
}

export default TypedMessage
