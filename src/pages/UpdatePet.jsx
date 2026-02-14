import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

function UpdatePet() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Buscar owners
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [searchOwner, setSearchOwner] = useState("");
  
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        sex: "",
        species: "",
        breed: "", 
        color: "", 
        isNeutered: false,
        photoUrl: "",
        owner: ""
    });

    useEffect(() => {
    fetch(`http://localhost:3000/owner/pets/mypet/${petId}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
        .then(res => res.json())
        .then(data => {
            const pet = data.data;

            setFormData({
                name: pet.name || "",
                age: pet.age || "",
                sex: pet.sex,
                species: pet.species,
                breed: pet.breed || "",
                color: pet.color || "",
                isNeutered: pet.isNeutered ?? false,
                photoUrl: pet.photoUrl || "",
                owner: pet.owner
            });
        });
    }, []);

    // traer owners del back
    const fetchOwners = async (query) => {
        try {
            setLoadingOwners(true);

            const res = await axios.get(
            `http://localhost:3000/users/allowners?query=${query}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            const options = res.data.data.map((owner) => ({
                value: owner._id,
                label: `${owner.firstName} ${owner.lastName} - ${owner.email}`,
            }));

            setOwnerOptions(options);
        } catch (error) {
            console.error("Error buscando owners", error);
        } finally {
            setLoadingOwners(false);
        };
    };

    const handleOwnerSelect = (option) => {
    setSelectedOwner(option);

    setFormData((prev) => ({
        ...prev,
        owner: option.value,
    }));
    };

    // Debounce, retrasa la busqueda de owners para no saturar de peticiones
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchOwner.length >= 2) {
            fetchOwners(searchOwner);
            } else {
            setOwnerOptions([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
        }, [searchOwner]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

  // manejar archivo de foto, para la foto de perfil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
      setFormData({
          ...formData,
          photo: file,
      });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`http://localhost:3000/owner/pets/${petId}`,
    formData,
    {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
    }
    );

    alert("Mascota actualizada");
    navigate("/pets");
  };

  return (
    <form onSubmit={handleSubmit}>
        <h2>Editar mascota</h2>
            <label htmlFor="name">
                Nombre
                <input name="name" value={formData.name} onChange={handleChange} />
            </label>

            <label htmlFor="age">
                Edad
                    <input
                        name="age"
                        placeholder="Edad"
                        value={formData.age}
                        onChange={handleChange}
                    />
            </label>

            <label htmlFor="sex">
                Sexo
                <select name="sex" value={formData.sex} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                </select>
            </label>

            <label htmlFor="species">
                Especie
                <select name="species" value={formData.species} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="DOG">Perro</option>
                    <option value="CAT">Gato</option>
                </select>
            </label>

            <label htmlFor="breed">
                Raza
                <input 
                    name="breed"
                    placeholder="Raza"
                    value={formData.breed}
                    onChange={handleChange}
                />
            </label>

            <label htmlFor="color">
                Color
                <input 
                    name="color"
                    placeholder="Color"
                    value={formData.color}
                    onChange={handleChange}
                />
            </label>

            <label htmlFor="isNeutered">
                Estado de castración
                <input
                    type="checkbox" 
                    name="isNeutered" 
                    checked={formData.isNeutered} 
                    onChange={handleChange} 
                />
            </label>

            <label htmlFor="photoUrl" >
                Añadir foto
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
            </label>

            <label>
                Dueño de la mascota
                <Select
                    placeholder="Buscar dueño por nombre o apellido..."
                    isLoading={loadingOwners}
                    options={ownerOptions}
                    value={selectedOwner}
                    onChange={handleOwnerSelect}
                    onInputChange={(value) => setSearchOwner(value)}
                    noOptionsMessage={() => "No se encontraron dueños"}
                />
            </label>

        <button type="submit">Guardar cambios</button>
    </form>
  );
}

export default UpdatePet;
