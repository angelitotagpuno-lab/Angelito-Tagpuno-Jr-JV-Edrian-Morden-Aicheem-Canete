import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [editId, setEditId] = useState(null);

  const loadItems = async () => {
    const res = await fetch("http://localhost:3001/items");
    setItems(await res.json());
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submitForm = async () => {
    const url = editId
      ? `http://localhost:3001/items/${editId}`
      : "http://localhost:3001/items";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", quantity: "", price: "" });
    setEditId(null);
    loadItems();
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:3001/items/${id}`, {
      method: "DELETE",
    });
    loadItems();
  };

  const editItem = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, quantity: item.quantity, price: item.price });
  };

  return (
    <div className="container">
      <h1>Inventory System</h1>

      <div className="form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button className="btn btn-primary" onClick={submitForm}>
          {editId ? (
            <>
              <i className="bi bi-pencil-fill"></i> Update
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle-fill"></i> Add
            </>
          )}
        </button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <span className="badge-qty">{item.quantity}</span>
              </td>
              <td>
                <span className="badge-price">${item.price}</span>
              </td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => editItem(item)}
                >
                  <i className="bi bi-pencil-fill"></i> Edit
                </button>
                <button className="btn-del" onClick={() => deleteItem(item.id)}>
                  <i className="bi bi-trash-fill"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
