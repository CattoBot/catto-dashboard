var log;
var loggeduser;


// Esta función es para poder intercambiar variables entre archivos xd
async function returnLoggedUser() {
    return loggeduser
}




// Indicamos la función que se ejecutará al iniciar la página
window.onload = async function () {


    // Intentamos conectarnos a la base de datos, si
    // no lo logramos, devolvemos error en el login.
    try {
        await indexedDB.startDB("user")
    } catch (err) {
        document.querySelector(".window").innerHTML += "<p class=\"advert\">La base de datos ha fallado y no ha sido posible conectarse a tu cuenta</p>"
        document.querySelector("button.discord").disabled = true
        document.querySelector("button.discord").classList.add("disabled")
        document.querySelector(".glassmorphism").classList.remove("hidden")
        destroyLoader()
        console.error(err)
        return console.warn("Error en la base de datos")
    }



    // Creamos un nuevo login gracias a un constructor.
    // Los login no son más que 
    log = new login();


    // Si existen datos en la base de datos, cargamos en el
    // login los datos de la base de datos.
    list_length = await indexedDB.listLength("data", 1)
    if (list_length) {
        let data_log = await indexedDB.displayData("data")
        let guilds_log = await indexedDB.displayData("guilds")
        await sleep(500)
        log.load(data_log[0], guilds_log)
    }



    // (Si no hay datos) conectamos con la API para iniciar una petición.
    if (log.token == undefined || log.token == "") {
        await log.fetch()
    }


    // Almacenamos en la variable, el objeto usuario ya construído
    loggeduser = log.buildUser()


    // Si no hay usuario, o el usuario está caducado, se cancela el login
    // y solicitamos al usuario que inicie sesión. De lo contrario,
    // finalizamos el login escondiendo la ventana de login.
    if (loggeduser != undefined && loggeduser.data.expiration > Date.now()) {
        loggeduser.loadUser()
        document.querySelector(".glassmorphism").classList.add("hidden")
        loggeduser.save()
    } else {
        document.querySelector(".glassmorphism").classList.remove("hidden")
    }


    // Una vez todo está en orden, construímos el menú contextual, las
    // opciones, los servidores y las ventanas emergentes.
    await build.contextMenu()
    await build.options(data.obtener("server") == "settings" ? "settings" : "server")
    await build.servers()
    startWindows()


    // Y como ya todo está preparado, nos cargamos el loader.
    destroyLoader()
}





// Con esta función cambiamos de página
async function goPage(page) {

    // Primero, guardamos la ID de la página que queremos visitar
    data.establecer("page", page)

    // Ahora, si hay alguna página ya marcada, la desmarcamos, y
    // después marcamos la actual.
    try {
        document.querySelector(`.options .selected`).classList.remove("selected")
    } catch {} finally {
        document.getElementById(page).classList.add("selected")
    }
}





// Con esta función cambiamos de servidor
async function goServer(server) {

    // Desmarcamos el servidor que está marcado actualmente
    document.querySelector(`.servers .selected`).classList.remove("selected")
    
    // Guardamos la información del nuevo servidor
    data.establecer("server", server)

    // Si este servidor, no es en realidad el apartado de ajustes,
    // buscamos su nombre y lo mostramos dónde corresponde
    if (server!="settings") { data.establecer("server_name", document.getElementById(server+"_icon").alt) }
    
    // Eliminamos la información a cerca de la página anterior que se
    // estuviese viendo
    data.eliminar("page")

    // Marcamos el nuevo servidor como seleccionado
    document.getElementById(data.obtener("server")).classList.add("selected")
    
    // Actualizamos las opciones del servidor
    await build.options(data.obtener("server") == "settings" ? "settings" : "server")
}





// Con esta función iniciamos las ventanas emergentes
function startWindows() {

    // Función que nos permite cerrar la ventana de ayuda
    document.getElementById("return_help").addEventListener("click", async function() {
        data.eliminar("page")
        document.querySelector(`.options .selected`).classList.remove("selected")
        document.getElementById("help_window").style.opacity = "0"
        document.getElementById("help_window").style.transform = "scale(0.9)"
        await sleep(330)
        document.getElementById("help_window").style.visibility = "hidden"
    })
}