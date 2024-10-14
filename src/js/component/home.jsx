import React, { useState, useEffect } from "react";

// Crear el componente Home
const Home = () => {
  const [inputValues, setInputValues] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manejar cambios en los inputs del modal
  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  // Abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Manejar el guardado de los datos ingresados en el modal
  const handleSave = () => {
    const { name, email, phone, address } = inputValues;

    // Verificar que todos los campos estén completos
    if (!name || !email || !phone || !address) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Crear el objeto para enviar a la API
    const newContact = {
      name,
      email,
      phone,
      address,
    };

    // Hacer la solicitud POST a la API
    fetch("https://playground.4geeks.com/contact/agendas/jhow/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((data) => {
        // Actualizar el estado con el nuevo contacto agregado
        setContacts([...contacts, data]);
        // Limpiar los valores del modal
        setInputValues({
          name: "",
          email: "",
          phone: "",
          address: "",
        });
        closeModal(); // Cerrar el modal
      })
      .catch((error) => console.error("Error al agregar contacto:", error));
  };

  // GET: Obtener contactos del servidor
  const getUserContacts = () => {
    fetch("https://playground.4geeks.com/contact/agendas/jhow", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud GET");
        }
        return response.json();
      })
      .then((result) => {
        // Acceder a la propiedad contacts de la respuesta
        setContacts(result.contacts);
      })
      .catch((error) => console.error("Error al obtener contactos:", error));
  };

  // DELETE: Eliminar un contacto
  const deleteContact = (id) => {
    fetch(`https://playground.4geeks.com/contact/agendas/jhow/contacts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setContacts(contacts.filter((contact) => contact.id !== id));
        }
      })
      .catch((error) => console.error("Error al eliminar contacto:", error));
  };

  // useEffect Hooks: Obtener contactos al cargar el componente
  useEffect(() => {
    getUserContacts();
  }, []);

  return (
    <div className="Container">
      <h1>Contact List</h1>
      
      <button onClick={openModal}>Agregar Nuevo Contacto</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nuevo Contacto</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={inputValues.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={inputValues.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={inputValues.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={inputValues.address}
              onChange={handleInputChange}
            />
            <button onClick={handleSave}>Guardar Contacto</button>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      <ul>
        {contacts.length === 0 ? (
          <li>No hay contactos, añade uno</li>
        ) : (
          contacts.map((contact, index) => (
            <li key={index}>
              {contact.name} - {contact.email} - {contact.phone} - {contact.address}
              <button onClick={() => deleteContact(contact.id)}>🗑️</button>
            </li>
          ))
        )}
      </ul>
      
      <div>{contacts.length} Contactos</div>
    </div>
  );
};

export default Home;
