import React, { useState } from 'react';

export default function TaarsApp() {
  // --- ESTADOS GLOBALES MOCK (Simulando una base de datos) ---
  const [professors, setProfessors] = useState([
    { id: 1, name: 'Prof. Ana Gómez', category: 'Matemáticas' },
    { id: 2, name: 'Prof. Carlos Ruiz', category: 'Español' },
  ]);
  
  const [classesList, setClassesList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  
  // Control de navegación
  const [activeTab, setActiveTab] = useState('nueva-clase');
  
  // Estado para la clase en curso
  const [activeClass, setActiveClass] = useState(null);

  // --- COMPONENTES DE VISTA ---

  // 1. Gestión de Profesores
  const ProfessorManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Profesores</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border-b">Nombre</th>
            <th className="p-3 border-b">Categoría (Materia)</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((prof) => (
            <tr key={prof.id}>
              <td className="p-3 border-b">{prof.name}</td>
              <td className="p-3 border-b">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{prof.category}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
        + Añadir Profesor
      </button>
    </div>
  );

  // 2. Nueva Clase (Auto-asignación)
  const NewClassForm = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [assignedProf, setAssignedProf] = useState('');
    const [dayIndex, setDayIndex] = useState(1);

    const handleCategoryChange = (e) => {
      const cat = e.target.value;
      setSelectedCategory(cat);
      // Automatización: Buscar profesor asignado a la categoría
      const prof = professors.find((p) => p.category === cat);
      setAssignedProf(prof ? prof.name : 'Sin profesor asignado');
    };

    const startClass = () => {
      if (!selectedCategory) return alert('Selecciona una categoría');
      setActiveClass({ category: selectedCategory, professor: assignedProf, day: dayIndex });
      setActiveTab('clase-activa');
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nueva Clase</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Categoría (Materia)</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="">Seleccionar...</option>
            {professors.map((p) => (
              <option key={p.id} value={p.category}>{p.category}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Profesor Asignado (Automático)</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-gray-100 text-gray-600" 
            value={assignedProf} 
            readOnly 
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Día de Clase</label>
          <input 
            type="number" 
            min="1"
            className="w-full p-2 border rounded" 
            value={dayIndex} 
            onChange={(e) => setDayIndex(e.target.value)}
          />
        </div>

        <button 
          onClick={startClass}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded font-bold hover:bg-blue-700 transition"
        >
          Iniciar Clase
        </button>
      </div>
    );
  };

  // 3. Interfaz de Clase en Curso (Generador de Audio)
  const ActiveClassView = () => {
    const [wordText, setWordText] = useState('');

    const playAudio = () => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(wordText);
        utterance.lang = activeClass.category === 'Español' ? 'es-ES' : 'en-US';
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Tu navegador no soporta la generación de audio.");
      }
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Clase: {activeClass.category}</h2>
            <p className="text-gray-600">Prof: {activeClass.professor} | Día: {activeClass.day}</p>
          </div>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div> En Curso
          </span>
        </div>

        <div className="p-4 bg-gray-50 rounded border mb-6">
          <h3 className="font-bold text-lg mb-2">Generador de Audio</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Escribe una palabra o frase..." 
              className="flex-1 p-2 border rounded"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
            />
            <button 
              onClick={playAudio}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🔊 Escuchar
            </button>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('post-clase')}
          className="w-full bg-red-600 text-white px-4 py-3 rounded font-bold hover:bg-red-700 transition"
        >
          Finalizar Clase
        </button>
      </div>
    );
  };

  // 4. Reporte y Validación Post-Clase
  const PostClassView = () => {
    const [summary, setSummary] = useState("1. Leer capítulo 4\n2. Traer materiales para maqueta\n3. Conceptos básicos de suma");
    const [validatedItems, setValidatedItems] = useState([]);

    const handleValidation = () => {
      const lines = summary.split('\n');
      const newTasks = lines.map((line, index) => ({
        id: Date.now() + index,
        description: line,
        isTask: true, // Por defecto marcamos como tarea para que el profe valide
        status: 'Pendiente'
      }));
      setValidatedItems(newTasks);
    };

    const toggleIsTask = (id) => {
      setValidatedItems(validatedItems.map(item => 
        item.id === id ? { ...item, isTask: !item.isTask } : item
      ));
    };

    const saveReport = () => {
      const confirmedTasks = validatedItems.filter(item => item.isTask);
      setTasksList([...tasksList, ...confirmedTasks]);
      setActiveClass(null);
      setActiveTab('tareas');
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reporte de Clase Finalizada</h2>
        
        <label className="block font-bold mb-2">Resumen / Notas (Separa por líneas)</label>
        <textarea 
          className="w-full p-2 border rounded mb-4" 
          rows="4" 
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        ></textarea>
        
        <button onClick={handleValidation} className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
          Generar y Validar Tareas
        </button>

        {validatedItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Verifica: ¿Cuáles son tareas?</h3>
            {validatedItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded mb-2 border">
                <input 
                  type="checkbox" 
                  checked={item.isTask} 
                  onChange={() => toggleIsTask(item.id)}
                  className="w-5 h-5"
                />
                <span className={item.isTask ? "font-bold text-gray-800" : "text-gray-400 line-through"}>
                  {item.description}
                </span>
                <span className="ml-auto text-sm bg-gray-200 px-2 py-1 rounded">
                  {item.isTask ? 'Tarea' : 'Apunte'}
                </span>
              </div>
            ))}
            <button onClick={saveReport} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Guardar Reporte y Tareas
            </button>
          </div>
        )}
      </div>
    );
  };

  // 5. Gestión de Tareas
  const TaskManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestor de Tareas y Notas</h2>
      {tasksList.length === 0 ? (
        <p className="text-gray-500">No hay tareas generadas aún.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Descripción</th>
              <th className="p-3 border-b">Estado</th>
              <th className="p-3 border-b">Nota / Calificación</th>
            </tr>
          </thead>
          <tbody>
            {tasksList.map(task => (
              <tr key={task.id}>
                <td className="p-3 border-b font-medium">{task.description}</td>
                <td className="p-3 border-b">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{task.status}</span>
                </td>
                <td className="p-3 border-b">
                  <input type="number" placeholder="0/100" className="w-20 p-1 border rounded text-sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // --- RENDER PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar / Menú Lateral */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-extrabold mb-8 tracking-wider text-blue-400">TAARS</h1>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('profesores')} className={`text-left p-3 rounded hover:bg-gray-800 transition ${activeTab === 'profesores' ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}>Gestión Profesores</button>
          <button onClick={() => setActiveTab('nueva-clase')} className={`text-left p-3 rounded hover:bg-gray-800 transition ${activeTab === 'nueva-clase' ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}>Nueva Clase</button>
          <button onClick={() => setActiveTab('tareas')} className={`text-left p-3 rounded hover:bg-gray-800 transition ${activeTab === 'tareas' ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}>Gestión de Tareas</button>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-8">
        {activeTab === 'profesores' && <ProfessorManagement />}
        {activeTab === 'nueva-clase' && <NewClassForm />}
        {activeTab === 'clase-activa' && <ActiveClassView />}
        {activeTab === 'post-clase' && <PostClassView />}
        {activeTab === 'tareas' && <TaskManagement />}
      </div>
    </div>
  );
}
