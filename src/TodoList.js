import React, { Fragment, useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import './App.css'
import axios from 'axios'

function TodoList() {

    const [todoData, settodoData] = useState([])
    const [taskContent, settaskContent] = useState("")

    const defaultValue = {
        task: ""
    }

    useEffect(() => {
        axios.get('https://jj-todolist.herokuapp.com/get/todoList').then((response) => {
            if (response) {
                settodoData(response.data.data)
            }
        })
    }, [])


    const submitHandler = () => {
        const task = { content: taskContent }
        axios.post('https://jj-todolist.herokuapp.com/todolist', task).then((response) => {
            if (response.data.err) {
                alert(response.data.err)
            } else {
                alert(response.data.msg)
                settodoData([...todoData, { _id: response.data._id, content: task }])
            }
        })
    }

    const completeHandler = (id) => {
        axios.delete(`https://jj-todolist.herokuapp.com/todoList/completed/${id}`).then((response) => {
            if (response.data.delete === false) {
                alert(response.data.msg)
            } else {
                alert(response.data.msg)
                settodoData(todoData.filter((val) => {
                    return val._id != id ? { _id: id, Task: val.Task } : val
                }))
                window.location.reload()
            }
        })
    }
    return (
        <Fragment>
            <Container>
                <header>Jj's To Do List</header>
                <form className='TodoList_Input' defaultValue={defaultValue} onSubmit={submitHandler}>
                    <input type="text" placeholder='To Do Task (E.g. Learn React for 1 hour..)' className='form-control' onChange={(e) => { settaskContent(e.target.value) }} name='task' />
                    <Button variant="secondary" type='submit'>Submit</Button>
                </form>
                <div className='TodoList_Table'>
                    <h5>To Do List. You have {todoData.length} Left. {todoData.length < 1 ? <span>Keep it up </span> : <span>Well Done, You have no more Task for Today!</span>} </h5>
                    <hr />
                    <ul>
                        {todoData.map((val, index) => {
                            return <li><h6>{val.Task}</h6>  <span><Button onClick={() => { completeHandler(val._id) }} variant="outline-success">Completed</Button></span> </li>
                        })}
                    </ul>
                </div>
            </Container>
        </Fragment>
    )
}

export default TodoList
