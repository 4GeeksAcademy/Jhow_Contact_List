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
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);

  
  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  
  const openModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false); 
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
    setInputValues({ name: "", email: "", phone: "", address: "" }); 
    setCurrentContactId(null); 
  };

  
  const handleSave = () => {
    const { name, email, phone, address } = inputValues;

    
    if (!name || !email || !phone || !address) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    const newContact = { name, email, phone, address };

    
    if (isEditMode) {
      fetch(`https://playground.4geeks.com/contact/agendas/jhow/contacts/${currentContactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud PUT");
          }
          return response.json();
        })
        .then((data) => {
          setContacts(contacts.map(contact => (contact.id === currentContactId ? data : contact))); // Actualizar el contacto en la lista
          closeModal(); // Cerrar el modal
        })
        .catch((error) => console.error("Error al editar contacto:", error));
    } else {
      
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
          setContacts([...contacts, data]); 
          closeModal(); 
        })
        .catch((error) => console.error("Error al agregar contacto:", error));
    }
  };

  
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
        setContacts(result.contacts);
      })
      .catch((error) => console.error("Error al obtener contactos:", error));
  };

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

  const openEditModal = (contact) => {
    setInputValues({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
    });
    setCurrentContactId(contact.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getUserContacts();
  }, []);

  return (
    <div className="Container">
      <h1>AGENDA DE CONTACTOS</h1>
      <div className="up"> 
      <button onClick={openModal} className="add-button">Agregar Nuevo Contacto</button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditMode ? "Editar Contacto" : "Nuevo Contacto"}</h2>
            <img
    className="foto"
    src="https://cdn3.pixelcut.app/1/3/profile_picture_1728ecf2bd.jpg"
    alt="perfil"
  />
            <label for="name">Nombre Completo</label>
            <input 
              type="text"
              name="name"
              value={inputValues.name}
              onChange={handleInputChange}
            />
            <label for="name">E-mail</label>
            <input 
              type="email"
              name="email"
              value={inputValues.email}
              onChange={handleInputChange}
            />
            <label for="name">Teléfono</label>
            <input 
              type="text"
              name="phone"
              value={inputValues.phone}
              onChange={handleInputChange}
            />
            <label for="name">Dirección</label>
            <input className="entry"
              type="text"
              name="address"
              value={inputValues.address}
              onChange={handleInputChange}
            />
            <button className="update" onClick={handleSave}>{isEditMode ? "Actualizar Contacto" : "Guardar Contacto"}</button>
            <button onClick={closeModal}>Regresar</button>
            </div>
        </div>
      )}

      <ul>
        {contacts.length === 0 ? (
          <li>No hay contactos, añade uno</li>
        ) : (
          contacts.map((contact, index) => (
            <div className="new_contact" key={index}>
  <li>
    <h5>Nombre: {contact.name}</h5>
    <h5>E-mail: {contact.email}</h5>
    <h5>Teléfono: {contact.phone}</h5>
    <h5>Dirección: {contact.address}</h5>
  </li>
  <img
    className="perfil"
    src="https://cdn3.pixelcut.app/1/3/profile_picture_1728ecf2bd.jpg"
    alt="perfil"
  />
  <button  onClick={() => openEditModal(contact)}>✏️ Editar</button>
  <button  onClick={() => deleteContact(contact.id)}>🗑️ Eliminar</button>
</div>
          ))
        )}
      </ul>
      
      <div>{contacts.length} Contactos</div>
    </div>
  );
};

export default Home;
