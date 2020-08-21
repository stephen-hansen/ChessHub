import React from "react";

class Chat extends React.Component{
	constructor(props){
		super(props);
		this.socket = this.props.socket;
		this.state = {
			username: this.props.username,
			message: "",
			messages: []
		};
	}

	componentDidMount(){
		this.socket.on("newMessage", (data) => {
			addMessage(data);
		});
		const addMessage = data => {
			this.setState({messages: [...this.state.messages, data]});
		}

		this.sendMessage = ev => {
			ev.preventDefault();
			this.socket.emit("sendMessage", {
				author: this.state.username, message: this.state.message});
			this.setState({message: ""});
		}
	}

	enterPressed(e){
		let code = e.keyCode || e.which;
		if(code == 13){
			this.sendMessage(e);
		}
	}

	render(){
		return(
			<div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Chat</div>
                                <hr/>
                                <div className="messages">
                                    {this.state.messages.map((message, i) => {
                                        return (
                                            <div key={i}>{message.author}: {message.message}</div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="card-footer">
                                <br/>
                                <input type="text" placeholder="Message" 
								className="form-control" value={this.state.message} 
								onChange={ev => this.setState({message: ev.target.value})}
								onKeyPress={this.enterPressed.bind(this)}/>
                                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>		
		);	
	}
}

export default Chat;
