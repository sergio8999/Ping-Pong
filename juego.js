import{Bola, Pala, Juego} from "./clases.js";

var elId;

function main(){
    let svg = document.getElementsByTagName('svg')[0];
    let juego = new Juego(svg);
    let juegoNuevo = document.getElementById("jugarNuevo"); 

    window.addEventListener('keydown',(e)=>{
        let tecla = e.key;
        if(tecla == "w" || tecla == "s" || tecla == "W" || tecla == "S")
            juego.pala1.moverPala(tecla);
        else
        juego.pala2.moverPala(tecla);
    });

    window.addEventListener('keyup',(e)=>{
        let tecla = e.key;
        if(tecla == "w" || tecla == "s" || tecla == "W" || tecla == "S")
        juego.pala1.pararPala(tecla);
        else
        juego.pala2.pararPala(tecla);
    });

    // Jugar de nuevo
    juegoNuevo.addEventListener('click',()=>{
        juego.juegoNuevo();
        juegoNuevo.disabled = true;
        elId = window.requestAnimationFrame(() =>{juego.loop()});
    })

    elId = window.requestAnimationFrame(() =>{juego.loop()});

}


window.addEventListener('load',main);