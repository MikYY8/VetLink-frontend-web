import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

function CreateAppointment() {
    const [formData, setFormData] = useState({pet: "", owner: "", vet: "", date: "",
        time: "", type: "", vaccineName: "", details: "", price: "",
        status: "" })
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const prices = {
        CONSULTATION: 5000,
        CONTROL: 4000,
        VACCINATION: 3000,
        SURGERY: 10000, 
    };
    const token = localStorage.getItem("token");

    // Buscar mascotas
    const [petOptions, setPetOptions] = useState([]);
    const [loadingPets, setLoadingPets] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [searchPet, setSearchPet] = useState("");

    // Buscar owners
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [searchOwner, setSearchOwner] = useState("");

    // Buscar veterinarios
    const [vetOptions, setVetOptions] = useState([]);
    const [loadingVets, setLoadingVets] = useState(false);
    const [selectedVet, setSelectedVet] = useState(null);
    const [searchVet, setSearchVet] = useState("");

    // Buscar horarios
    const [availabilityOptions, setAvailabilityOptions] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [searchAvailability, setSearchAvailability] = useState("");

    // Validacion de errores en el form
    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // actualizar datos en el input 
    const handleChange = (e) => {
        setFormData({
        ...formData, [e.target.name]: e.target.value
        });
    };


    // traer mascotas del back 
    const fetchPets = async (query) => {
        try {
            setLoadingPets(true);

            const res = await axios.get(
            `http://localhost:3000/owner/allpets?query=${query}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            const options = res.data.data.map((pet) => ({
                value: pet._id,
                // OWNER SE POPULA MAL (ME SALE "object Object")
                label: `${pet.name} - ${pet.owner.firstName} ${pet.owner.lastName}`,
            }));

            setPetOptions(options);
        } catch (error) {
            console.error("Error buscando mascotas", error);
        } finally {
            setLoadingPets(false);
        };
    };

    const handlePetSelect = (option) => { 
    setSelectedPet(option);

    setFormData((prev) => ({
        ...prev,
        pet: option.value,
    }));
    };

    // Debounce, retrasa la busqueda de PETS para no saturar de peticiones
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchPet.length >= 2) {
                fetchPets(searchPet);
            } else {
                setPetOptions([]);
            };
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchPet]);


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
            };
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchOwner]);


    // traer vets del back 
    const fetchVetsByType = async (type) => {
        try {
            const res = await axios.get(`http://localhost:3000/appointment/vets-by-type?type=${type}`, {
                headers: 
                    { Authorization: `Bearer ${token}` } 
                }
            );

            const options = res.data.data.map((vet) => ({
                value: vet._id,
                label: `${vet.firstName} ${vet.lastName} - ${vet.specialty}`,
            }));

            setVetOptions(options);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingVets(false);
        };
    };

    const handleVetSelect = (option) => {
        setSelectedVet(option);

        setFormData((prev) => ({
            ...prev,
            vet: option.value,
        }));
    };

    // 
    useEffect(() => {
        if (formData.type) {
            fetchVetsByType(formData.type);
        };
    }, [formData.type]);

    useEffect(() => {
        if (formData.type === "VACCINATION" && selectedPet) {
            fetchVaccines(selectedPet.species);
        };
    }, [formData.type, selectedPet]);

    useEffect(() => {
        if (formData.vet && formData.date) {
            fetchAvailability();
        };
    }, [formData.vet, formData.date]);

    useEffect(() => {
        if (formData.type) {
            setFormData((prev) => ({
            ...prev,
            price: prices[formData.type],
            }));
        };
    }, [formData.type]);


    // traer horarios disponibles del back 
    const fetchAvailability = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/appointment/available`, {
                params: {
                    vetId: formData.vet,
                    date: formData.date,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            const options = res.data.data.map((block) => ({
                value: block.time,
                label: block.time,
            }));

            setAvailabilityOptions(options);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAvailabilitySelect = (option) => {
    setSelectedAvailability(option);

    setFormData((prev) => ({
        ...prev,
        availability: option.value,
    }));
    };

    // Debounce, retrasa la busqueda de horarios(?) para no saturar de peticiones
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchAvailability.length >= 2) {
                fetchAvailability(searchAvailability);
            } else {
                setAvailabilityOptions([]);
            };
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchAvailability]);

    // envío de datos en el form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validate()){
            alert("Se ha guardado el turno")
            console.log(formData)
        };

        const data = new FormData();

        data.append("pet", formData.pet);
        data.append("owner", formData.owner);
        data.append("vet", formData.vet);
        data.append("date", formData.date);
        data.append("time", formData.time);
        data.append("type", formData.type);
        data.append("vaccineName", formData.vaccineName);
        data.append("details", formData.details);
        data.append("price", formData.price);
        data.append("status", formData.status);

        try{

            await axios.post("http://localhost:3000/appointment/make-appointment", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess("Se ha guardado el turno");
            setFormData({
                pet: "", 
                owner: "", 
                vet: "", 
                date: "",
                time: "", 
                type: "", 
                vaccineName: "", 
                details: "", 
                price: "",
                status: "" 
            });

            setSelectedOwner(null);
        }catch(err){
            console.log(err.response?.data || err);
        };
    };


    return(
        <div>
            <h2>Agendar turno</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Mascota*
                    <Select
                        placeholder="Buscar mascota por nombre..."
                        isLoading={loadingPets}
                        options={petOptions}
                        value={selectedPet}
                        onChange={handlePetSelect}
                        onInputChange={(value) => setSearchPet(value)}
                        noOptionsMessage={() => "No se encontraron mascotas"}
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

                <label htmlFor="type">
                    Tipo de turno*
                    <select name="type" value={formData.type} onChange={handleChange} >
                        <option value="">Seleccione tipo de turno</option>
                        <option value="CONSULTATION">Consulta</option>
                        <option value="CONTROL">Control</option>
                        <option value="VACCINATION">Vacunación</option>
                        <option value="SURGERY">Cirugía</option>
                    </select>                
                </label>
                
                    {formData.type === "VACCINATION" && (
                        <label>
                            Vacuna*
                            <Select
                                options={vaccineOptions}
                                onChange={handleVaccineSelect}
                            />
                        </label>
                    )}

                <label>
                    Veterinario
                    <Select
                        placeholder="Buscar veterinario por nombre o apellido..."
                        isLoading={loadingVets}
                        options={vetOptions}
                        value={selectedVet}
                        onChange={handleVetSelect}
                        onInputChange={(value) => setSearchVet(value)}
                        onMenuOpen={() => { if (formData.type) fetchVetsByType(formData.type) }}
                        noOptionsMessage={() => "No se encontraron veterinarios disponibles"}
                    />
                </label>

               {formData.vet && (
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                        }
                    />
                )}


                <label>
                    Seleccione horario disponible
                    <Select
                        placeholder="Horarios disponibles"
                        isLoading={loadingAvailability}
                        options={availabilityOptions}
                        value={selectedAvailability}
                        onChange={handleAvailabilitySelect}
                        onInputChange={(value) => setSearchAvailability(value)}
                        noOptionsMessage={() => "No se encontraron horarios disponibles"}
                    />
                </label>

                <label htmlFor="details">
                    Detalles (opcional)
                    <input 
                       name="details"
                        placeholder="Información adicional para el turno"
                        value={formData.details}
                        onChange={handleChange}
                    />
                </label>

                <label htmlFor="price">
                    Precio (aproximado, sujeto a cambios el día del turno)
                    <input value={formData.price} readOnly />
                </label>

                <button type="submit">Agendar turno</button>

                <Link to="/dashboard"><button>
                    Volver
                    </button>
                </Link>
                {success && <p style={{color: "green"}}>{success}</p>}
            </form>
        </div>
    );
};

export default CreateAppointment;