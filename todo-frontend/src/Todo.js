import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [edittitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");
  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setMessage("Item Added successfully");
            setTitle("");
            setDescription("");
            getItems(); // Refresh list
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Unable to create Todo item");
          }
        })
        .catch(() => setError("Error connecting to server"));
    } else {
      setError("Title and Description are required");
    }
  };

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    fetch(`${apiUrl}/todos/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: edittitle, description: editdescription }),
    })
      .then((res) => {
        if (res.ok) {
          setMessage("Item updated successfully");
          setEditId(-1);
          getItems(); // Refresh list
          setTimeout(() => setMessage(""), 3000);
        } else {
          setError("Update failed");
        }
      })
      .catch(() => setError("Server error during update"));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setMessage("Item deleted");
          getItems();
          setTimeout(() => setMessage(""), 3000);
        } else {
          setError("Delete failed");
        }
      })
      .catch(() => setError("Server error during delete"));
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>TO-DO list Project using MERN Stack</h1>
      </div>

      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="form-group d-flex gap-2">
        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="form-control"
          type="text"
        />
        <input
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="form-control"
          type="text"
        />
        <button className="btn btn-dark" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column me-2">
                {editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <div className="form-group d-flex gap-2">
                    <input
                      placeholder="Title"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={edittitle}
                      className="form-control"
                      type="text"
                    />
                    <input
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editdescription}
                      className="form-control"
                      type="text"
                    />
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId !== item._id ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button className="btn btn-warning" onClick={handleUpdate}>
                    Update
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
