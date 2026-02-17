import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";

function CreateAppointment() {

  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({ pet: "", owner: "", vet: "",
    date: "", time: "", type: "", vaccineName: "", details: "", price: "" });

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

  const prices = { CONSULTATION: 5000, CONTROL: 4000, VACCINATION: 3000, SURGERY: 10000, };

  // ================= PETS =================

  const fetchPets = async () => {
    const res = await axios.get("http://localhost:3000/owner/allpets", {
      headers: { Authorization: `Bearer ${token}` },
    });

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
        price: prices[formData.type],
      }));
      fetchVetsByType(formData.type);
    }
  }, [formData.type]);

  // ================= VETS =================

  const fetchVetsByType = async (type) => {
    const res = await axios.get(
      `http://localhost:3000/appointment/vets-by-type?type=${type}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

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
    if (formData.vet && formData.date) {
      fetchAvailability();
    }
  }, [formData.vet, formData.date]);

  const fetchAvailability = async () => {
    const res = await axios.get(
      "http://localhost:3000/appointment/available",
      {
        params: {
          vetId: formData.vet,
          date: formData.date,
        },
        headers: { Authorization: `Bearer ${token}` },
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

  // ================= VACCINES =================

    useEffect(() => {
    if (formData.type === "VACCINATION" && selectedPet) {
      fetchVaccines(selectedPet.species);
    }
  }, [formData.type, selectedPet]);


  const fetchVaccines = async (species) => {
    const res = await axios.get(
      `http://localhost:3000/appointment/vaccines?species=${species}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = res.data.data.map((vaccine) => ({
      value: vaccine.name,
      label: vaccine.name,
    }));

    setVaccineOptions(options);
  };


  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/appointment/make-appointment",
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Turno creado correctamente");
  };

  // ================= RENDER =================

  return (
    <div>
      <h2>Agendar turno</h2>

      <form onSubmit={handleSubmit}>

        <label>Mascota*</label>
        <Select
          options={petOptions}
          value={selectedPet}
          onChange={handlePetSelect}
        />

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

        <label>Tipo de turno*</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="CONSULTATION">Consulta</option>
          <option value="CONTROL">Control</option>
          <option value="VACCINATION">Vacunación</option>
          <option value="SURGERY">Cirugía</option>
        </select>

        {formData.type === "VACCINATION" && (
          <>
            <label>Vacuna*</label>
            <Select
              options={vaccineOptions}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  vaccineName: opt.value,
                }))
              }
            />
          </>
        )}

        <label>Veterinario*</label>
        <Select
          options={vetOptions}
          value={selectedVet}
          onChange={handleVetSelect}
        />

        {formData.vet && (
          <>
            <label>Fecha*</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </>
        )}

        {formData.date && (
          <>
            <label>Horario*</label>
            <Select
              options={availabilityOptions}
              value={selectedAvailability}
              onChange={handleAvailabilitySelect}
            />
          </>
        )}

        <label>Detalles</label>
        <input
          name="details"
          value={formData.details}
          onChange={handleChange}
        />

        <label>Precio</label>
        <input value={formData.price} readOnly />

        <button type="submit">Agendar turno</button>

        <Link to="/dashboard">
          <button type="button">Volver</button>
        </Link>

        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
}

export default CreateAppointment;
