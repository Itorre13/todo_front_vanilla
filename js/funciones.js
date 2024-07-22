const contTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputTexto = document.querySelector('form input[type="text"]');

// CARGA INICIAL DE LOS DATOS
fetch("https://api-todo-postgres-a32c.onrender.com/tareas")
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.sort((a,b) => a.id - b.id).forEach(({id,tarea,terminada}) => { // esto las ordena descendientemente y devuelve al array ordenado. Y por cada una de esas tareas con el forEach queremos hacer algo
        new Tarea(id,tarea,terminada,contTareas); // por cada tarea que me llegue del back pintaré una tarea en el front
    }); 
});


formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    
    if(inputTexto.value.trim() != ""){
        
        let tarea = inputTexto.value.trim();

        fetch("https://api-todo-postgres-a32c.onrender.com/tareas/nueva", {
            method : "POST",
            body : JSON.stringify({tarea}),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id,error}) => { // las dos posibles propiedades de esta respuesta son id y error. Si todo salió bien es id y si algo falló es error
            if(!error){ // si no hay error
                new Tarea(id,tarea,false,contTareas);
                return inputTexto.value = ""; // para que se limpie el campo
            }
            console.log("..mostrar error al usuario");
        });

    }
});
