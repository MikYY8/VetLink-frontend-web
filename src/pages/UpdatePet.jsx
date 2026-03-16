import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dog } from "lucide-react";
import api from "../utils/axios";
import Select from "react-select";
import { toast } from 'react-toastify';

function UpdatePet() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");

    const [ageInputType, setAgeInputType] = useState("AGE"); // DATE | AGE
    const [ageValue, setAgeValue] = useState("");
    const [ageUnit, setAgeUnit] = useState("MONTHS");

    // Buscar owners
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [searchOwner, setSearchOwner] = useState("");

    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.name) {newErrors.name = "Ingrese el nombre de la mascota"};
        if (ageInputType === "DATE" && !formData.birthDate) {
            newErrors.birthDate = "Ingrese la fecha de nacimiento";
        };
        if (ageInputType === "AGE" && !ageValue) {
            newErrors.age = "Ingrese la edad aproximada";
        };
        if(!formData.sex) {newErrors.sex = "Seleccione el sexo de la mascota"};
        if(!formData.species) {newErrors.species = "Seleccione la especie de la mascota"};
        if(!formData.breed) {newErrors.breed = "Ingrese la raza de la mascota"};
        if(!formData.color) {newErrors.color = "Ingrese color de la mascota"};
        if(!formData.owner) {newErrors.owner = "Seleccione el dueño asociado a la mascota"};

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };
  
    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        isEstimated: false,
        sex: "",
        species: "",
        breed: "", 
        color: "", 
        isNeutered: false,
        photoUrl: "",
        owner: ""
    });

    // useEffect(() => {
    //     api.get(`/owner/pets/mypet/${petId}`)
    //     .then(res => res.json())
    //     .then(data => {
    //         const pet = data.data;

    //         const formattedBirthDate = pet.birthDate
    //             ? pet.birthDate.split("T")[0]
    //             : "";

    //         setFormData({
    //             name: pet.name || "",
    //             birthDate: formattedBirthDate,
    //             isEstimated: pet.isEstimated ?? false,
    //             sex: pet.sex,
    //             species: pet.species,
    //             breed: pet.breed || "",
    //             color: pet.color || "",
    //             isNeutered: pet.isNeutered ?? false,
    //             photoUrl: pet.photoUrl || "",
    //             owner: pet.owner._id
    //         });

    //         // set radio button correcto
    //         if (pet.isEstimated) {
    //             setAgeInputType("AGE");
    //         } else {
    //             setAgeInputType("DATE");
    //         };

    //         setSelectedOwner({
    //             value: pet.owner?._id,
    //             label: pet.owner?.firstName 
    //                 ? `${pet.owner.firstName} ${pet.owner.lastName}`
    //                 : "Dueño sin nombre"
    //         });
    //     });
    // }, []);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await api.get(`/owner/pets/mypet/${petId}`);
                const pet = res.data.data;

                const formattedBirthDate = pet.birthDate
                    ? pet.birthDate.split("T")[0]
                    : "";

                setFormData({
                    name: pet.name || "",
                    birthDate: formattedBirthDate,
                    isEstimated: pet.isEstimated ?? false,
                    sex: pet.sex,
                    species: pet.species,
                    breed: pet.breed || "",
                    color: pet.color || "",
                    isNeutered: pet.isNeutered ?? false,
                    photoUrl: pet.photoUrl || "",
                    owner: pet.owner._id
                });

                if (pet.isEstimated) {
                    setAgeInputType("AGE");
                } else {
                    setAgeInputType("DATE");
                }

                setSelectedOwner({
                    value: pet.owner?._id,
                    label: pet.owner?.firstName
                        ? `${pet.owner.firstName} ${pet.owner.lastName}`
                        : "Dueño sin nombre"
                });

            } catch (err) {
                console.error(err);
            }
        };

        fetchPet();
    }, []);

    // traer owners del back
    const fetchOwners = async (query) => {
        try {
            setLoadingOwners(true);

            const res = await api.get(
            `/users/allowners?query=${query}`);

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
    if(validate()){
        navigate("/pets")
        toast.success("Mascota actualizada con éxito")
        // console.log(formData)
    };

    let finalFormData = { ...formData };

    if (ageInputType === "AGE") {
        const today = new Date();
        let birthDate = new Date(today);

        if (ageUnit === "YEARS") {
            birthDate.setFullYear(today.getFullYear() - parseInt(ageValue));
        } else {
            birthDate.setMonth(today.getMonth() - parseInt(ageValue));
        }

        finalFormData.birthDate = birthDate.toISOString().split("T")[0];
        finalFormData.isEstimated = true;
    } else {
        finalFormData.isEstimated = false;
    }

    await api.put(`/owner/pets/${petId}`, finalFormData);
  };

  return (
    <div className="main-container">
        <h2 className="cool-h2-text"><Dog size={30} /> Editar mascota</h2>
        <div className="pets-form-dad">
            <form className="pets-form-child" onSubmit={handleSubmit}>
                <label htmlFor="name">
                    Nombre
                    <input name="name" 
                        id="pet-input-1"
                        value={formData.name} 
                        onChange={handleChange} 
                    />
                </label>

                {error.name && <p style={{color: "red"}} >{error.name}</p>}

                <label>Edad de la mascota*</label>

                <div style={{ marginBottom: "10px" }}>
                    <label>
                        <input
                            type="radio"
                            value="DATE"
                            checked={ageInputType === "DATE"}
                            onChange={() => setAgeInputType("DATE")}
                        />
                            Sé la fecha de nacimiento
                    </label>

                    <label style={{ marginLeft: "10px" }}>
                        <input
                            type="radio"
                            value="AGE"
                            checked={ageInputType === "AGE"}
                            onChange={() => setAgeInputType("AGE")}
                        />
                            No sé la fecha, solo la edad aproximada
                    </label>
                </div>

                {ageInputType === "DATE" && (
                    <input
                        id="pet-input-2a"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                            setFormData({ ...formData, birthDate: e.target.value })
                        }
                    />
                )}

                {ageInputType === "AGE" && (
                    <div>
                        <input
                            id="pet-input-2b"
                            type="number"
                            placeholder="Edad"
                            value={ageValue}
                            onChange={(e) => setAgeValue(e.target.value)}
                        />

                        <select
                            id="pet-input-2c"
                            value={ageUnit}
                            onChange={(e) => setAgeUnit(e.target.value)}
                        >
                            <option value="MONTHS">Meses</option>
                            <option value="YEARS">Años</option>
                        </select>
                    </div>
                )}

                {error.birthDate && <p style={{color: "red"}} >{error.birthDate}</p>}
                {error.age && <p style={{color: "red"}} >{error.age}</p>}

                <label htmlFor="sex">
                    Sexo
                    <select id="pet-input-3" name="sex" value={formData.sex} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                </label>

                {error.sex && <p style={{color: "red"}} >{error.sex}</p>}

                <label htmlFor="species">
                    Especie
                    <select id="pet-input-4" name="species" value={formData.species} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="DOG">Perro</option>
                        <option value="CAT">Gato</option>
                    </select>
                </label>

                {error.species && <p style={{color: "red"}} >{error.species}</p>}

                <label htmlFor="breed">
                    Raza
                    <input 
                        id="pet-input-5"
                        name="breed"
                        placeholder="Raza"
                        value={formData.breed}
                        onChange={handleChange}
                    />
                </label>

                {error.breed && <p style={{color: "red"}} >{error.breed}</p>}

                <label htmlFor="color">
                    Color
                    <input 
                        id="pet-input-6"
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
                        id="pet-input-7"
                        type="checkbox" 
                        name="isNeutered" 
                        checked={formData.isNeutered} 
                        onChange={handleChange} 
                    />
                </label>

                <label htmlFor="photoUrl" >
                    Añadir foto
                    <input 
                        id="pet-input-8"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                </label>

                <label>
                    Dueño de la mascota
                    <Select
                        id="pet-input-9"
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

                <div className="center-stupid-div-again">
                    <button className="pet-btn" type="submit">Guardar cambios</button>
                    <Link to="/pets">
                        <button className="pet-btn" >
                            Volver
                        </button>
                    </Link>
                </div>
            </form> 
        </div>
    </div>
  );
}

export default UpdatePet;
