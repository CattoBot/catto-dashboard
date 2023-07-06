const leaderboard = {
    user: {
        options: async function() {

            await sleep(1000)
            const servers = await myIndexedDB.displayData("guilds")
            var useradmin = false;

            window.addEventListener("click", function (e) {

                servers.forEach(server => {
                    if (server.id == data.obtener("server")) {
                        useradmin = ((server.permissions & 0x8) == 0x8)
                    }
                })

                // Creamos un nuevo menú contextual
                const ctm = new contextmenuBuilder()

                if (e.target.id.endsWith("_options") || e.target.parentNode.id.endsWith("_options")) {

                    if (useradmin) {
                        ctm.setItems([
                            {
                                class: "primary closeonclick",
                                onclick: `leaderboard.setXP('${e.target.id.split("_")[0]}', 'txt')`,
                                label: "Establecer TXT XP"
                            },
                            {
                                class: "primary closeonclick",
                                onclick: `leaderboard.setXP('${e.target.id.split("_")[0]}', 'vc')`,
                                label: "Establecer VC XP"
                            },
                            {
                                class: "danger closeonclick",
                                onclick: `leaderboard.clearXP('${e.target.id.split("_")[0]}', 'txt')`,
                                label: "Reiniciar TXT XP"
                            },
                            {
                                class: "danger closeonclick",
                                onclick: `leaderboard.clearXP('${e.target.id.split("_")[0]}', 'vc')`,
                                label: "Reiniciar VC XP"
                            },
                        ])
                    }

                    ctm.addItem({
                        class: "secondary closeonclick",
                        onclick: `copy('${e.target.id.split("_")[0]}')`,
                        label: "Copiar ID"
                    })

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
                }

            })
        }
    },
    clearXP(userID, type) {
        window.alert("¡Esta función no está disponible!")
    },
    setXP(userID, type) {
        window.alert("¡Esta función no está disponible!")
    }
}