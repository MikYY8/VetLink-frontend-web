import { useState, useEffect } from "react";
import api from "../utils/axios";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardClock } from 'lucide-react';
import { toast } from 'react-toastify';

function CreateAppointment() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({ pet: "", owner: "", vet: "",
    date: "", time: "", type: "", vaccineName: "", details: "" });

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  // Si funciona, funciona, aunque sea medio lioso
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [searchOwner, setSearchOwner] = useState("");

  const [petOptions, setPetOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [vetOptions, setVetOptions] = useState([]);
  const [availabilityOptions, setAvailabilityOptions] = useState([]);
  const [vaccineOptions, setVaccineOptions] = useState([]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState({});

  // const prices = { CONSULTATION: 5000, CONTROL: 4000, VACCINATION: 3000, SURGERY: 10000, };

  // ================= VALIDATIONS =================

    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.pet) {newErrors.pet = "Seleccione la mascota"};
        if(!formData.owner) {newErrors.owner = "Seleccione el dueño de la mascota"};
        if(!formData.vet) {newErrors.vet = "Seleccione un veterinario"};
        if(!formData.date) {newErrors.date = "Seleccione una fecha disponible"};
        if(!formData.time) {newErrors.time = "Seleccione un horario disponible"};
        if(!formData.type) {newErrors.type = "Seleccione el tipo de turno"};

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  // ================= PETS =================

  const fetchPets = async () => {
    const res = await api.get("/owner/allpets");

    const options = res.data.data.map((pet) => ({
      value: pet._id,
      label: `${pet.name} - ${pet.owner.firstName} ${pet.owner.lastName}`,
      species: pet.species,
      ownerId: pet.owner._id,
    }));

    setPetOptions(options);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handlePetSelect = (option) => {
    setSelectedPet(option);

    setFormData((prev) => ({
      ...prev,
      pet: option.value,
      owner: option.ownerId,
    }));
  };

  // ================= OWNERS =================

    const fetchOwners = async (query) => {
        try {
            setLoadingOwners(true);

            const res = await api.get(`/users/allowners?query=${query}`);

            const options = res.data.data.map((owner) => ({
                value: owner._id,
                label: `${owner.firstName} ${owner.lastName} - ${owner.email}`,
            }));

            setOwnerOptions(options);
        } catch (error) {
            console.log("Error buscando owners", error);
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

  // ================= TYPE (APPOINTMENT) =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (formData.type) {
      setFormData((prev) => ({
        ...prev,
        // price: prices[formData.type],
      }));
      fetchVetsByType(formData.type);
    }
  }, [formData.type]);

  // ================= VETS =================

  const fetchVetsByType = async (type) => {
    const res = await api.get(`/appointment/vets-by-type?type=${type}`);

    const options = res.data.data.map((vet) => ({
      value: vet._id,
      label: `${vet.firstName} ${vet.lastName} - ${vet.specialty}`,
    }));

    setVetOptions(options);
  };

  const handleVetSelect = (option) => {
    setSelectedVet(option);
    setFormData((prev) => ({ ...prev, vet: option.value }));
  };

  // ================= DATE + AVAILABILITY =================

  useEffect(() => {
    if (formData.vet) {
      fetchAvailableDates();
      setAvailabilityOptions([]);
      setSelectedDate(null);
      setFormData(prev => ({ ...prev, date: "", time: "" }));
    }
  }, [formData.vet]);


  const fetchAvailability = async () => {
    const res = await api.get(`/appointment/available`, {
        params: {
          vetId: formData.vet,
          date: formData.date,
        },
      }
    );

    const options = res.data.data.map((block) => ({
      value: block.time,
      label: block.time,
    }));

    setAvailabilityOptions(options);
  };

  const handleAvailabilitySelect = (option) => {
    setSelectedAvailability(option);
    setFormData((prev) => ({ ...prev, time: option.value }));
  };

  const fetchAvailableDates = async () => {
    const res = await api.get(
      `/appointment/availability/dates/${formData.vet}`);

    const options = res.data.data.map(date => ({
      value: date,
      label: date
    }));

    setAvailableDates(options);
  };

  useEffect(() => {
    if (selectedDate && formData.vet) {
      fetchTimesByDate(selectedDate.value);
    }
  }, [selectedDate]);

  const fetchTimesByDate = async (date) => {
    const res = await api.get(
      `/appointment/availability/times/${formData.vet}/${date}`);

    const options = res.data.map(block => ({
      value: block.time,
      label: block.time
    }));

    setAvailabilityOptions(options);
  };

  // ================= VACCINES =================

    useEffect(() => {
    if (formData.type === "VACCINATION" && selectedPet) {
      fetchVaccines(selectedPet.species);
    }
  }, [formData.type, selectedPet]);


  const fetchVaccines = async (species) => {
    const res = await api.get(
      `/appointment/vaccines?species=${species}`);

    const options = res.data.data.map((vaccine) => ({
      value: vaccine.name,
      label: vaccine.name,
    }));

    setVaccineOptions(options);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(validate()){
      navigate("/dashboard")
      // toast.success("Veterinario creado con éxito")
      // console.log(formData);
    };

    await api.post("/appointment/make-appointment", {
      petId: formData.pet,
      ownerId: formData.owner,
      vetId: formData.vet,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      vaccineName: formData.vaccineName,
      details: formData.details,
      },
    );
  
    toast.success("Turno reservado con éxito")
    setSuccess("Turno creado correctamente");
  };

  // ================= RENDER =================

  return (
    <div className="main-container">
      <h2 className="cool-h2-text"><ClipboardClock size={30} /> Agendar turno</h2>
      <div className="appointment-form-dad">
        <form className="appointment-form-child" onSubmit={handleSubmit}>

          <label>
            Mascota*
            <Select
            id="appointment-input-1"
              placeholder={"Buscar mascota por nombre"}
              options={petOptions}
              value={selectedPet}
              onChange={handlePetSelect}
            />
          </label>
          {error.pet && <p style={{color: "red"}} >{error.pet}</p>}

          <label>
            Dueño de la mascota*
            <Select
              id="appointment-input-2"
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

          <label>
            Tipo de turno*
            <select id="appointment-input-3" name="type" value={formData.type} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="CONSULTATION">Consulta</option>
              <option value="CONTROL">Control</option>
              <option value="VACCINATION">Vacunación</option>
              <option value="SURGERY">Cirugía</option>
            </select>
          </label>
          {error.type && <p style={{color: "red"}} >{error.type}</p>}

          {formData.type === "VACCINATION" && (
            <>
              <label>Vacuna*
              <Select
                id="appointment-input-4"
                placeholder={"Seleccione una vacuna"}
                options={vaccineOptions}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    vaccineName: opt.value,
                  }))
                }
              />
              </label>
            </>
          )}

          <label>Veterinario*
            <Select
              id="appointment-input-5"
              placeholder={"Buscar veterinario por nombre o apellido"}
              options={vetOptions}
              value={selectedVet}
              onChange={handleVetSelect}
            />
          </label>

          {formData.vet && (
            <label>Fecha*
              <Select
                id="appointment-input-7"
                placeholder="Seleccione una fecha disponible"
                options={availableDates}
                value={selectedDate}
                onChange={(option) => {
                  setSelectedDate(option);
                  setFormData(prev => ({ ...prev, date: option.value, time: "" }));
                  setSelectedAvailability(null);
                  setAvailabilityOptions([]);
                }}
              />
            </label>
          )}

          {error.vet && <p style={{color: "red"}} >{error.vet}</p>}

          {formData.date && (
            <>
              <label>Horario*
                <Select
                  id="appointment-input-7"
                  options={availabilityOptions}
                  value={selectedAvailability}
                  onChange={handleAvailabilitySelect}
                  placeholder="Seleccione un horario"
                />
              </label>
            </>
          )}
          {error.time && <p style={{color: "red"}} >{error.time}</p>}

          <label>
            Detalles
            <input
              id="appointment-input-8"
              name="details"
              value={formData.details}
              onChange={handleChange}
            />
          </label>

          {/* <label>
            Precio (sujeto a cambios el día del turno)
            $ARS
            <input 
              id="appointment-input-9" 
              value={formData.price} 
              readOnly 
            />
          </label> */}

          <div className="center-stupid-div-again">
            <button className="pet-btn" type="submit">Agendar turno</button>
            <Link to="/dashboard">
              <button className="pet-btn">
                Volver
              </button>
            </Link>
          </div>

          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateAppointment;
