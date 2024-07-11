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
            this.actualizarEstado().then(() => botonEstado.classList.toggle("terminada"));
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    actualizarTexto(){
        if(this.editando){
           let textoTemporal = this.DOM.children[1].value.trim();

           if(textoTemporal != "" & textoTemporal != this.texto){
                this.texto = textoTemporal;
           }
        
           this.DOM.children[1].classList.remove("visible");
           this.DOM.children[0].innerText = this.texto;
           this.DOM.children[0].classList.add("visible");
           this.DOM.children[2].innerText = "editar";
 
        }else{
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.texto; //con setAttribute("value",this.texto) NO FUNCIONA. Hay que hacerlo de esa manera
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";
        }
        this.editando = !this.editando;
    }
    borrarTarea(){
        this.DOM.remove();
    }
    actualizarEstado(){
        return new Promise((ok,ko) => {
            ok();
        });
    }
}