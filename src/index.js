import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


class TodoApp extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.state = {
      tasks: [],
      text: '',
    };
  }

  async componentDidMount() {
    this.setState({ tasks: await (await getTasksRequest()).json() })
  }

  render() {
    return (
      <>
        <TaskList tasks={this.state.tasks} handleRemove={this.handleRemoveClick} />
        <TaskInput id="taskInput" value={this.state.text} onChange={this.handleChange} />
        <Button className='btn-add' text='Add Task' onClick={this.handleAddClick} />
      </>
    );
  };

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  async handleAddClick(e) {
    if (this.state.text.length === 0) { return }
    const respData = await (await addTaskRequest(this.state.text)).json();
    this.setState({ tasks: this.state.tasks.concat(respData) })
    this.setState({ text: '' })
  }

  async handleRemoveClick(e) {
    const respData = await (await removeTaskRequest(e.target.id)).json();
    this.setState({ tasks: this.state.tasks.filter(t => t.id !== respData.id) })
  }
}

function TaskList(props) {
  return (props.tasks.map((t) => <Task key={t.id} task={t} handleEdit={props.handleEdit} handleRemove={props.handleRemove} />));
}

function Task(props) {
  return (
    <div>
      <span className='task'> {props.task.content} </span >
      <Button className='btn-remove' id={props.task.id} text={'X'} onClick={props.handleRemove}></Button>
    </div>
  );
}

function TaskInput(props) {
  return <input type='text' value={props.value} onChange={props.onChange}></input>
}

function Button(props) {
  return <button className={props.className} id={props.id} onClick={props.onClick}>{props.text}</button>
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TodoApp />);





const url = "https://localhost:7141/api/todoitems/";

async function getTasksRequest() {
  return fetch(url);
}

function addTaskRequest(text) {
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers:
    {
      "Access-Control-Allow-Origin": "*",
      'Accept': 'application/json',
      'Content-Type': 'application/json',

    },
    body: JSON.stringify({ content: text })
  });
}

function removeTaskRequest(id) {
  return fetch(url + id, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    headers:
    {
      "Access-Control-Allow-Origin": "*",
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
}