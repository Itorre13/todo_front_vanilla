class Tarea{
    constructor(id,texto,estado,contenedor){
        this.id = id;
        this.texto = texto;
        this.editando = false;
        this.crearDOM(estado,contenedor);
    }
    crearDOM(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.className = "tarea";

        //texto de la tarea ---> h3
        let textoTarea = document.createElement("h3");
        textoTarea.className = "visible";
        textoTarea.innerText = this.texto;

        //editor tarea ---> input
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type","text");
        editorTarea.setAttribute("value",this.texto);

        //boton editar ---> button
        let botonEditar = document.createElement("button");
        botonEditar.className = "boton";
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click",() => this.actualizarTexto());

        //boton borrar ---> button
        let botonBorrar = document.createElement("button");
        botonBorrar.className = "boton";
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click",() => this.borrarTarea());

        //boton estado --> button
        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${ estado ? "terminada" : ""}`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click",() => {
            this.actualizarEstado()
            .then(() => botonEstado.classList.toggle("terminada"))
            .catch(() => console.log("...mostrar error a usuario"));
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    async actualizarTexto(){
        if(this.editando){ // si estamos editando
           let textoTemporal = this.DOM.children[1].value.trim(); // extraemos el texto temporal del input

           if(textoTemporal != "" & textoTemporal != this.texto){ // preguntamos si en efecto el usuario lo ha editado y la edición es correcta. No lo has dejado en blanco y has cambiado las cosas
            let {error} = await fetch("http://localhost:4000/tareas/actualizar/1/" + this.id,{ // el error lo quiero de esperar de esta llamada a fetch 
                    method : "PUT",
                    body : JSON.stringify({ tarea : textoTemporal }),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json()); // convertimos la respuesta en json

                if(!error){ // si no hay error
                    this.texto = textoTemporal; // mostrará el texto temporal
                }else{ // si hay error
                    console.log("..error al usuario"); // mostraremos un error al usuario
                }
           }
        
           this.DOM.children[1].classList.remove("visible"); // revierto toda la operación que ha activado la edición, ha cambiado el texto el botón, etc.
           this.DOM.children[0].innerText = this.texto;
           this.DOM.children[0].classList.add("visible");
           this.DOM.children[2].innerText = "editar";
 
        }else{
            this.DOM.children[0].classList.remove("visible"); // si no es estabamos editando q es como empezamos por defecto, lo que hacemos es cambiar el DOM para que permita editar
            this.DOM.children[1].value = this.texto; //con setAttribute("value",this.texto) NO FUNCIONA. Hay que hacerlo de esa manera
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";
        }
        this.editando = !this.editando; // y pase lo que pase hacemos un toggle. Si estabas editando o no editando
    }

    actualizarEstado(){
        return new Promise((ok,ko) => {
            fetch("http://localhost:4000/tareas/actualizar/2/" + this.id, {// 2 es la operación del estado. Concatenamos el id xq siempre va al final de la url
                method : "PUT"
            })
            .then(respuesta => respuesta.json())
            .then(({error}) => {
                !error ? ok() : ko(); // si no hay error cumplo la promesa y de lo contrario la rechazo
            });
        });
    }    
    borrarTarea(){
        fetch("http://localhost:4000/tareas/borrar/" + this.id, {// concatenamos el id xq siempre va al final de la url
            method : "DELETE" // sólo metodo porque la informacion del cuerpo de la peticion y las cabeceras va en la URL
            })
            .then(respuesta => respuesta.json())
            .then(({resultado,error}) => { // se que puedo recibir resultado y un posible error. En este frontend el resultado es irrelevante, podríamos quedarnos sólo con el error.
                if(!error){ // si no tengo ningún error
                    return this.DOM.remove(); // se elemina del front
                }
                console.log("...mostrar error a usuario");
            });
    }
}