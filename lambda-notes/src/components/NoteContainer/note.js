import React, { Component } from 'react';
import axios from 'axios';
import DeleteModal from './deleteModal';
import EditNote from './editNote';
import './NoteView.css';


class Note extends Component {

    constructor(props) {
        super(props);
        this.state = {
            note: null,
            noteEditor: false,
            editTitle: '',
            editTextBody: '',
        };

    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.fetchNote(id);
    }

    fetchNote = id => {
        axios
            .get(`https://fe-notes.herokuapp.com/note/get/${id}`)
            .then(response => {
                this.setState(() => ({ note: response.data }))
            })
            .catch(error => {
                console.log(error);
            });
    };

    deleteNote = event => {
        event.preventDefault();
        axios
            .delete(`https://fe-notes.herokuapp.com/note/delete/${this.state.note._id}`)
            .then(response => {
                this.props.changeState(response.data)
            })
            .catch(err =>
                console.log(err));

        this.props.history.push('/');
    }

    openEditForm = () => {
        this.setState({ noteEditor: !this.state.noteEditor });
    };

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.id !== newProps.match.params.id) {
            this.fetchNote(newProps.match.params._id);
        }
    }

    saveEdits = event => {
        event.preventDefault();
        const saveEditNotes = {
            title: this.state.editTitle,
            textBody: this.state.editTextBody
        }

        axios
            .put(`https://fe-notes.herokuapp.com/note/edit/${this.state.note._id}`, saveEditNotes)
            .then(response => {
                console.log('EDIT RESPONSE', response);
                this.setState({
                    note: response.data
                })
            })
            .then(response => {
                this.props.changeState(this.state.note);
            })

            .catch(err =>
                console.log(err));

        this.setState({
            editTitle: '',
            editTextBody: '',

        })
        this.openEditForm();
    }


    editHandler = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        if (!this.state.note) {
            return <div> Loading Note...</div>
        }
        console.log('NOTES maybe', this.state);
        return (
            <div>
                <p onClick={this.openEditForm}>edit </p>
                <DeleteModal deleteNote={this.deleteNote} />

                {this.state.noteEditor ? (
                    <EditNote notes={this.state.note}
                        saveEdits={this.saveEdits}
                        editHandler={this.editHandler}
                    />
                ) : (<h1>{this.state.note.title}
                </h1>)}

                {this.state.noteEditor ? null :
                    <p> {this.state.note.textBody}</p>}

            </div>
        )
    }
}

export default Note;