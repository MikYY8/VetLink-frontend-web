import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function RegisterPet() {
    const [formData, setFormData] = useState({name: "", age: "", sex: "", species: "",
        breed: "", color: "", isNeutered: false, photoUrl: "", 
        owner: "" })
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");

    // Buscar owners
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [searchOwner, setSearchOwner] = useState("");


    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.name) {newErrors.name = "Ingrese el nombre de la mascota"};
        if(!formData.age) {newErrors.age = "Ingrese la edad aproximada de la mascota"};
        if(!formData.sex) {newErrors.sex = "Seleccione el sexo de la mascota"};
        if(!formData.species) {newErrors.species = "Seleccione la especie de la mascota"};
        if(!formData.breed) {newErrors.breed = "Ingrese la raza de la mascota"};
        if(!formData.color) {newErrors.color = "Ingrese color de la mascota"};
        if(!formData.owner) {newErrors.owner = "Seleccione el dueño asociado a la mascota"};

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // actualizar datos en el input 
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // manejar archivos de fotos
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            photo: file,
        });
    };

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

    // manejar seleccion de owners en el form
    // const handleOwnerSelect = (selectedOption) => {
    //     setSelectedOwner(selectedOption);

    //     setFormData({
    //         ...formData,
    //         owner: selectedOption.value, // guardamos el _id
    //     });
    // };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedOwner) {
            setError({ owner: "Seleccione un dueño" });
            return;
        }

        const data = new FormData();

        data.append("name", formData.name);
        data.append("age", formData.age);
        data.append("sex", formData.sex);
        data.append("species", formData.species);
        data.append("breed", formData.breed);
        data.append("color", formData.color);
        data.append("isNeutered", formData.isNeutered);

        // 🔴 CLAVE
        data.append("owner", selectedOwner.value);

        if (formData.photo) {
            data.append("photo", formData.photo);
        }

        try {
            console.log("SelectedOwner:", selectedOwner);
            console.log("FormData owner:", formData.owner);

            await axios.post("http://localhost:3000/owner/pets/add", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            setSuccess("Mascota creada con éxito");
            setFormData({
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

            setSelectedOwner(null);
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const data = new FormData();

    //     if(validate()){
    //         alert("Mascota creada correctamente")
    //         console.log(formData);
    //     };

    //     data.append("name", formData.name);
    //     data.append("age", formData.age);
    //     data.append("sex", formData.sex);
    //     data.append("species", formData.species);
    //     data.append("breed", formData.breed);
    //     data.append("color", formData.color);
    //     data.append("isNeutered", formData.isNeutered);
    //     data.append("owner", formData.owner);

    //     if (formData.photo) {
    //         data.append("photo", formData.photo); 
    //     };

    //     try{
    //         await axios.post("http://localhost:3000/owner/pets/add",
    //         data, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         setFormData({name: "", age: "", sex: "", species: "",
    //             breed: "", color: "", isNeutered: false, 
    //             photoUrl: "", owner: "" })
    //         setSuccess("Mascota creada con éxito")
    //     }catch(err){
    //         console.log(err);
    //     }
    // };

    return(
        <div>
            <h2>Registrar mascota</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">
                    Nombre*
                    <input 
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                {error.name && <p style={{color: "red"}} >{error.name}</p>}

                <label htmlFor="age">
                    Edad*
                    <input
                        name="age"
                        placeholder="Edad"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </label>
                {error.age && <p style={{color: "red"}} >{error.age}</p>}

                <label htmlFor="sex">
                    Sexo*
                    <select name="sex" value={formData.sex} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                </label>
                {error.sex && <p style={{color: "red"}} >{error.sex}</p>}

                <label htmlFor="species">
                    Especie*
                    <select name="species" value={formData.species} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="DOG">Perro</option>
                        <option value="CAT">Gato</option>
                    </select>
                </label>
                {error.species && <p style={{color: "red"}} >{error.species}</p>}

                <label htmlFor="breed">
                    Raza*
                    <input 
                       name="breed"
                        placeholder="Raza"
                        value={formData.breed}
                        onChange={handleChange}
                    />
                </label>
                {error.breed && <p style={{color: "red"}} >{error.breed}</p>}

                <label htmlFor="color">
                    Color*
                    <input 
                       name="color"
                        placeholder="Color"
                        value={formData.color}
                        onChange={handleChange}
                    />
                </label>
                {error.color && <p style={{color: "red"}} >{error.color}</p>}

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
                    Dueño de la mascota*
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
                {error.owner && <p style={{ color: "red" }}>{error.owner}</p>}

                <button type="submit">Crear mascota</button>
                {success && <p style={{color: "green"}}>{success}</p>}
            </form>
        </div>
    );
};

export default RegisterPet;