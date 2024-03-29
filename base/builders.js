const build = {
    servers() {

        return new Promise(async function (resolve, reject) {
            if (!data.existe("server")) {
                data.establecer("server", "settings")
            }
            let guilds = loggeduser.guilds
            let list = []
            guilds.forEach(guild => {
                list.push({
                    separator: false,
                    id: guild.id,
                    img: {
                        src: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`,
                        id: `${guild.id}_icon`
                    },
                    name: guild.name
                })
            })
            list = list.sort((x, y) => parseInt(x.id) - parseInt(y.id));
            list = list.reverse()
            list.push({
                separator: true
            })
            list.push({
                separator: false,
                id: "settings",
                img: {
                    src: "./media/png/catto.png",
                    id: "cattopfp"
                },
                name: "Ajustes"
            })
            list = list.reverse()
            let procesado = []
            list.forEach(e => {
                if (e.separator) {
                    procesado.push('<div class="separator"></div>')
                } else {                                                                          // Cambiar a "false":"true" cuándo se arregle el reorganizador de servidores
                    procesado.push(`<div ${e.id ? `id="${e.id}"` : ""} draggable="${e.id == "settings" ? "false" : "false"}" onclick="goServer('${e.id}')" ${data.obtener("server") == e.id ? 'class="selected"' : ''}><img draggable="false" src="${e.img.src}" ${e.img.id ? `id="${e.img.id}"` : ""} alt="${e.name}" title="${e.name}"></div>`)
                }
            })
            procesado.push('<div class="reload" onclick="window.location.reload()"><svg viewBox="0 0 24 24"><path d="M16.519 9.348h4.5v-4.5"></path><path d="M17.831 17.831a8.25 8.25 0 1 1 0-11.662l3.188 3.178"></path></svg></div>')
            document.querySelector(".servers").innerHTML = procesado.join("\n")

            resolve()
        });
    },
    contextMenu() {

        return new Promise(async function (resolve, reject) {

            window.oncontextmenu = function (e) {

                // Creamos un nuevo menú contextual
                const ctm = new contextmenuBuilder()

                if (e.target.id.endsWith("_icon")) {

                    // Agregamos los elementos del menú
                    ctm.setItems([
                        {
                            class: "secondary closeonclick",
                            onclick: `copy('${e.target.id.split("_")[0]}')`,
                            label: "Copiar ID"
                        }
                    ])

                    ctm.place(e.clientX, e.clientY)
                    ctm.build()

                    var clickHandler = function (e) {
                        if ((!ctm.element.contains(e.target) || e.target.classList.contains("closeonclick")) && ctm.element) {
                            ctm.destroy();
                            window.removeEventListener("click", clickHandler);
                            window.removeEventListener("contextmenu", clickHandler);
                        }
                    };
                    
                    window.addEventListener("click", clickHandler);
                    window.addEventListener("contextmenu", clickHandler);

                } else if (document.getElementById("profile").contains(e.target)) {

                    // Agregamos los elementos del menú
                    ctm.setItems([
                        {
                            class: "danger closeonclick",
                            onclick: `loggeduser.logOut()`,
                            label: "Cerrar sesión"
                        }
                    ])

                    ctm.place(e.clientX, e.clientY - 50)
                    ctm.build()

                    var clickHandler = function (e) {
                        if ((!ctm.element.contains(e.target) || e.target.classList.contains("closeonclick")) && ctm.element) {
                            ctm.destroy();
                            window.removeEventListener("click", clickHandler);
                        }
                    };
                    
                    window.addEventListener("click", clickHandler);
                }
                return false
            }
            resolve()
        });
    },

    /**
     * @param {string} type
     */

    async options(type) {

        return new Promise(async function (resolve, reject) {
            const menu = await require("base/builders/menus.json", true)
            document.querySelector(".items").innerHTML = ""
            if (type == "server") {
                const servers = await myIndexedDB.displayData("guilds")
                var useradmin = false;
                await sleep(100)
                servers.forEach(server => {
                    if (server.id == data.obtener("server")) {
                        useradmin = ((server.permissions & 0x8) == 0x8)
                    }
                })
                document.querySelector(".title p").innerHTML = data.obtener("server_name")
                menu.server.forEach(element => {
                    if (element.separator && (!element.admin || (element.admin && useradmin))) {
                        document.querySelector(".items").innerHTML += `<div class="separator"></div>`
                    } else if (!element.admin || (element.admin && useradmin)) {
                        document.querySelector(".items").innerHTML += `<div class="${element.disabled ? "disabled" : ""}" id="${element.id}" ${element.disabled ? "" : `onclick="goPage('${element.id}')"`}>${element.svg}<p>${element.title}</p></div>`
                    }
                })
                if (!useradmin) {
                    document.querySelector(".items").innerHTML += `<div class="separator"></div><div class="adv"><p>Algunas opciones han sido ocultadas<br>Falta permiso de administrador</p></div>`
                }
            } else if (type == "settings") {
                document.querySelector(".title p").innerHTML = "Catto y tú"
                menu.settings.forEach(element => {
                    if (element.separator) {
                        document.querySelector(".items").innerHTML += `<div class="separator"></div>`
                    } else {
                        document.querySelector(".items").innerHTML += `<div class="${element.disabled ? "disabled" : ""}" id="${element.id}" ${element.disabled ? "" : `onclick="goPage('${element.id}')"`}>${element.svg}<p>${element.title}</p></div>`
                    }
                })
            }
            if (data.existe("page")) {
                document.getElementById(data.obtener("page")).classList.add("selected")
            }

            try {
                document.getElementById("ayuda").addEventListener("click", function () {
                    document.getElementById("help_window").style.visibility = "visible"
                    document.getElementById("help_window").style.opacity = "1"
                    document.getElementById("help_window").style.transform = "scale(1)"
                })
            } catch { }
            resolve()
        })
    },
    /**
     * @param {boolean} visible
     * @param {boolean} buttonEnabled
     * @param {Array} msgList
     */
    loginWindow(visible, buttonEnabled, msgList) {

        if (!visible) {
            document.querySelector(".glassmorphism").classList.add("hidden")
        } else {
            document.getElementById("msgList").innerHTML = ""
            document.querySelector(".glassmorphism").classList.remove("hidden")
            if (buttonEnabled == undefined || buttonEnabled) {
                document.querySelector("button.discord").classList.remove("disabled")
            } else {
                document.querySelector("button.discord").classList.add("disabled")
            }
            msgList.forEach(msg => {
                document.getElementById("msgList").innerHTML += `<p class="${msg.class}">${msg.text}</p>`
            })
        }
    },
    async pages(type, page) {
        const pages = await require("base/builders/pages.json")
        await sleep(100)
        if (!pages[type][page]["content"] || pages[type][page]["content"] == "") return document.getElementById("settingsColumn").innerHTML = '<div class="error"><h1>¡Oh no!</h1><p>Esta página no está disponible. Lamentamos las molestias.</p></div>'
        document.getElementById("settingsColumn").innerHTML = pages[type][page]["content"]
    }
}