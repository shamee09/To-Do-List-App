const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware to parse JSON request bodies
const app = express();
app.use(express.json());
app.use(cors());
// Memory storage
//let todos = [];

//connect mongodb
mongoose.connect('mongodb://localhost:27017/to-do-list-app')
.then(() =>{
    console.log("Connected db!");
})
.catch((err) =>{
    console.log("Could not conected")
})

// creating schema
const todoSchema=new mongoose.Schema({
         title:{
            requried: true,
            type:String
         },
         description:String
})

// creating a model
const todomodel=mongoose.model('todo',todoSchema);

// Route
app.post('/todos', async(req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description,
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try
    {
        const newtodo=new todomodel({title,description});
        await newtodo.save(); 
        res.status(201).json(newtodo);
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }  
});
// Get all items
app.get('/todos',async(req,res) =>{
    try
    {
        const todos=await todomodel.find();
        res.json(todos);
    }
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    } 
});
// Update the items
app.put("/todos/:id",async(req,res)=>{
    try
    {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todomodel.findByIdAndUpdate(
            id,
            {title,description},
            {new: true}
        )
        
        if(!updatedTodo)
        {
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo)
    }
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    } 
   
})

// Delete a Todo item

app.delete('/todos/:id',async(req,res)=>{
    try
    {
        const id=req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
        
    } catch (error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }
   
})

// Server
const port = 8000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});