import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Dog } from 'lucide-react';
import { toast } from 'react-toastify';

function RegisterPet() {
    const [formData, setFormData] = useState({name: "", birthDate: "", isEstimated: false, sex: "", species: "",
        breed: "", color: "", isNeutered: false, photoUrl: "", 
        owner: "" })

    const [ageInputType, setAgeInputType] = useState("DATE"); // DATE | AGE
    const [ageValue, setAgeValue] = useState("");
    const [ageUnit, setAgeUnit] = useState("MONTHS");

    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const navigate = useNavigate()
    const token = localStorage.getItem("token");

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
            console.error("Error buscando dueños", error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validate()){
            toast.success("Mascota creada con éxito")
            // console.log(formData)
        };

        if (!selectedOwner) {
            setError({ owner: "Seleccione un dueño" });
            return;
        }

        let finalBirthDate;
        let isEstimated = false;

        if (ageInputType === "DATE") {
            finalBirthDate = formData.birthDate;
        } else {
            const today = new Date();
            const birth = new Date(today);

            if (ageUnit === "MONTHS") {
                birth.setMonth(today.getMonth() - ageValue);
            } else {
                birth.setFullYear(today.getFullYear() - ageValue);
            };

            finalBirthDate = birth.toISOString();
            isEstimated = true;
        };

        const data = new FormData();

        data.append("name", formData.name);
        data.append("birthDate", finalBirthDate);
        data.append("isEstimated", isEstimated);
        data.append("sex", formData.sex);
        data.append("species", formData.species);
        data.append("breed", formData.breed);
        data.append("color", formData.color);
        data.append("isNeutered", formData.isNeutered);
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
            setAgeValue("");
            setAgeUnit("MONTHS");
            setAgeInputType("DATE");

            setSelectedOwner(null);
        } catch (err) {
            console.log(err.response?.data || err);
        }
        navigate("/pets")
    };

    return(
        <div className="main-container">
            <h2 className="cool-h2-text"><Dog size={30} /> Registrar mascota</h2>
            <div className="pets-form-dad">
                <form className="pets-form-child" onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        Nombre*
                        <input 
                            id="pet-input-1"
                            name="name"
                            placeholder="Nombre"
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
                        type="number"
                        placeholder="Edad"
                        value={ageValue}
                        onChange={(e) => setAgeValue(e.target.value)}
                        />

                        <select
                        value={ageUnit}
                        onChange={(e) => setAgeUnit(e.target.value)}
                        >
                        <option value="MONTHS">Meses</option>
                        <option value="YEARS">Años</option>
                        </select>
                    </div>
                    )}


                    <label htmlFor="sex">
                        Sexo*
                        <select id="pet-input-3" name="sex" value={formData.sex} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                    </label>
                    {error.sex && <p style={{color: "red"}} >{error.sex}</p>}

                    <label htmlFor="species">
                        Especie*
                        <select id="pet-input-4" name="species" value={formData.species} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="DOG">Perro</option>
                            <option value="CAT">Gato</option>
                        </select>
                    </label>
                    {error.species && <p style={{color: "red"}} >{error.species}</p>}

                    <label htmlFor="breed">
                        Raza*
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
                        Color*
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
                        Dueño de la mascota*
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
                        <button className="pet-btn" type="submit">Crear mascota</button>
                        <Link to="/pets">
                            <button className="pet-btn">
                                Volver
                            </button>
                        </Link>
                    </div>
                    {success && <p style={{color: "green"}}>{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegisterPet;