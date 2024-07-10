const contTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputTexto = document.querySelector('form input[type="text"]');

formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    
    if(inputTexto.value.trim() != ""){
        new Tarea(1,inputTexto.value.trim(),false,contTareas);
        inputTexto.value = "";
    }
});
