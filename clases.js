class Bola{
    constructor(x,y,radio,svg){
        this.tamanoSvg = svg.getBoundingClientRect();
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.velocidadX = 6;
        this.velocidadY = -6; 
        this.posAnteriorX = this.x;
        this.posAnteriorY = this.y;
        this.velocidadBola = 1;
        

        // Dibujar bola
        this.newBola=document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.newBola.setAttribute("cx",this.x);
        this.newBola.setAttribute("cy",this.y);
        this.newBola.setAttribute("r",this.radio);
        this.newBola.setAttribute("fill","#ccff00");
        svg.appendChild(this.newBola);
    }

    moverBola(){
        // Chocar paredes 
        this.posAnteriorX = this.x;
        this.posAnteriorY = this.y;
        this.x += this.velocidadX * this.velocidadBola;
        this.y += this.velocidadY *this.velocidadBola;     
        if(this.y-this.radio <= 0 || this.y+this.radio >= this.tamanoSvg.height){
            this.velocidadY *=-1;
            this.x = this.posAnteriorX;
            this.y = this.posAnteriorY;
        }     
    }

    get bolaSubiendo(){
        return this.posAnteriorY > this.y;
    }

    /**
     * 
     * @param {Pala} pala1 
     * @param {Pala} pala2 
     */
    // Comprobar colision con rectangulo
     comprobarColision(cx, cy, radius, rx, ry, rw, rh) {
        let testX = cx;
        let testY = cy;
      
        // Comprobacion donde choca
        if (cx < rx)            // comprueba parte izquierda pala
            testX = rx;      
        else if (cx > rx+rw)    // comprueba parte derecha pala
            testX = rx+rw;   
        if (cy < ry)            // comprueba parte superior pala
            testY = ry;      
        else if (cy > ry+rh)    // comprueba parte inferior pala
            testY = ry+rh;   
      
        // obtener distancia
        let distX = cx-testX;
        let distY = cy-testY;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );
      
        // si la distancia es menor que el radio hay colision
        if (distance <= radius) {
          return true;
        }
        return false;
      }

    colision(pala1,pala2){
        let medioPala1 = pala1.y + pala1.largo/2;
        let medioPala2 = pala2.y + pala2.largo/2;
        
        // Comprobar colision bola y direccion de bola para que depende donde choque la bola en la pala vaya hacia una direccion u otra

        if(this.comprobarColision(this.x,this.y,this.radio,pala1.x,pala1.y,pala1.ancho,pala1.largo)){
            if(this.bolaSubiendo && this.y > medioPala1)
                this.velocidadY *=-1;
            else if(!this.bolaSubiendo && this.y <= medioPala1)
                this.velocidadY *=-1; 
            this.x = this.posAnteriorX;
            this.y = this.posAnteriorY;
            this.velocidadX *=-1;
            // Incrementar velocidad de la bola
            this.velocidadBola += 0.05;
        }else if(this.comprobarColision(this.x,this.y,this.radio,pala2.x,pala2.y,pala2.ancho,pala2.largo)){
            if(this.bolaSubiendo && this.y > medioPala2)
                this.velocidadY *=-1;
            else if(!this.bolaSubiendo && this.y <= medioPala2)
                this.velocidadY *=-1;      

            this.x = this.posAnteriorX;
            this.y = this.posAnteriorY;
            this.velocidadX *=-1;
            // Incrementar velocidad de la bola
            this.velocidadBola += 0.05;
        }
    }

    dibuja(){
        this.newBola.setAttribute("cx",this.x);
        this.newBola.setAttribute("cy",this.y); 
    }
}

class Pala{
    constructor(x,y,ancho,largo,svg){
        this.tamanoSvg = svg.getBoundingClientRect();
        this.x = x;
        this.y = y;
        this.velocidadY = 6;
        this.ancho = ancho;
        this.largo = largo;
        
        // Crear pala
        this.newPala=document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.newPala.setAttribute("x",this.x);
        this.newPala.setAttribute("y",this.y);
        this.newPala.setAttribute("width",this.ancho);
        this.newPala.setAttribute("height",this.largo);
        this.newPala.setAttribute("fill","#ccff00");
        svg.appendChild(this.newPala);

        this.subirPala = false;
        this.bajarPala = false;
    }

    subir(){
        if(this.y > 0)
            this.y -= this.velocidadY;
            this.dibujar();
    }

    bajar(){
        if(this.y+this.largo < this.tamanoSvg.height)
            this.y += this.velocidadY;
            this.dibujar();
    }

    dibujar(){
        this.newPala.setAttribute("x",this.x);
        this.newPala.setAttribute("y",this.y);
    }

    moverPala(e){
        if(e == "w")
            this.subirPala = true;
        else if(e == "s")
            this.bajarPala = true;
    
        if(e == "ArrowUp")
            this.subirPala = true;
        else if(e == "ArrowDown")
            this.bajarPala = true;
    }
    
    /**
     * @param {KeyboardEvent} e
     */
    pararPala(e){
        if(e == "w")
            this.subirPala = false;
        else if(e == "s")
            this.bajarPala = false;
    
        if(e == "ArrowUp")
            this.subirPala = false;
        else if(e == "ArrowDown")
            this.bajarPala = false;
    } 
}

class Juego{
    constructor(svg){
        this.tamanoSvg = svg.getBoundingClientRect();
        this.pala1 = new Pala(10,this.tamanoSvg.height/2-65,20,130,svg);
        this.pala2 = new Pala(this.tamanoSvg.width-35,this.tamanoSvg.height/2-65,20,130,svg);
        this.bola = new Bola(this.tamanoSvg.width/2,this.tamanoSvg.height/2,20,svg);


        // Crear texto de resultado jugador 1 y 2

        this.textResultado1=document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.textResultado1.setAttribute("id","jugador1");
        this.textResultado1.setAttribute("x","35%");
        this.textResultado1.setAttribute("y","100");
        this.textResultado1.setAttribute("fill","white");
        this.textResultado1.setAttribute("stroke","rgba(3, 32, 128, 0.561)");
        this.textResultado1.setAttribute("stroke-width","1");
        this.textResultado1.setAttribute("style","font-size: 5em");
        this.textResultado1.textContent = "0";
        svg.appendChild(this.textResultado1);

        this.textResultado2=document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.textResultado2.setAttribute("id","jugador2");
        this.textResultado2.setAttribute("x","60%");
        this.textResultado2.setAttribute("y","100");
        this.textResultado2.setAttribute("fill","white");
        this.textResultado2.setAttribute("stroke","rgba(3, 32, 128, 0.561)");
        this.textResultado2.setAttribute("stroke-width","1");
        this.textResultado2.setAttribute("style","font-size: 5em");
        this.textResultado2.textContent = "0";
        svg.appendChild(this.textResultado2);

        // Victorias jugador
        this.victoriasJugador1 = 0;
        this.victoriasJugador2 = 0;
    }

    /**
     * @param {KeyboardEvent} e
    */


    haGanado(svg,jugador){
        // Crear texto de ganador
        this.newText=document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.newText.setAttribute("id","ganado");
        this.newText.setAttribute("x",this.tamanoSvg.width/2-200);
        this.newText.setAttribute("y","40%");
        this.newText.setAttribute("fill","white");
        this.newText.setAttribute("stroke","rgba(3, 32, 128, 0.561)");
        this.newText.setAttribute("stroke-width","1");
        this.newText.setAttribute("style","font-size: 4em");
        this.newText.textContent = "HA GANADO";
        svg.appendChild(this.newText);

        this.newText2=document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.newText2.setAttribute("id","jugador");
        this.newText2.setAttribute("x",this.tamanoSvg.width/2-175);
        this.newText2.setAttribute("y","70%");
        this.newText2.setAttribute("fill","white");
        this.newText2.setAttribute("stroke","rgba(3, 32, 128, 0.561)");
        this.newText2.setAttribute("stroke-width","1");
        this.newText2.setAttribute("style","font-size: 4em");
        this.newText2.textContent = jugador;
        svg.appendChild(this.newText2);
    }
    
    actualizarResultado(){
        // actualiza marcador y cambia la direccion de la bola para que vaya hacia quien ha ganado el punto
        if(this.bola.x - this.bola.radio <= 0 || this.bola.x + this.bola.radio >this.tamanoSvg.width){
            if(this.bola.x - this.bola.radio <= 0){
                this.victoriasJugador2++;
                this.textResultado2.textContent = this.victoriasJugador2;
                this.bola.velocidadX *=-1;
            }else{
                this.victoriasJugador1++;
                this.textResultado1.textContent = this.victoriasJugador1;
                this.bola.velocidadX *=-1;
            }
            this.bola.x = this.tamanoSvg.width/2;
            this.bola.y = this.tamanoSvg.height/2;
            // Volver a poner velocidad normal
            this.bola.velocidadBola = 1;
        }
    }

    // Resetear valores para jugar de nuevo
    juegoNuevo(){
        this.textResultado1.textContent = 0;
        this.textResultado2.textContent = 0;
        this.victoriasJugador1 = 0;
        this.victoriasJugador2 = 0;
        this.pala1.y = this.tamanoSvg.height/2-this.pala1.largo/2;
        this.pala2.y = this.tamanoSvg.height/2-this.pala2.largo/2;
        this.pala1.dibujar();
        this.pala2.dibujar();
        this.newText.remove();
        this.newText2.remove();
        this.bola.velocidadBola = 1;
    }

    loop(){
        let juegoNuevo = document.getElementById("jugarNuevo");
        let svg = document.getElementsByTagName('svg')[0];
        let elId;

        this.bola.moverBola();
        this.bola.colision(this.pala1,this.pala2);
        this.actualizarResultado();
        this.bola.dibuja();

        // Movimiento de palas
        if(this.pala1.subirPala)
        this.pala1.subir();
        else if(this.pala1.bajarPala)
        this.pala1.bajar();

        if(this.pala2.subirPala)
        this.pala2.subir();
        else if(this.pala2.bajarPala)
        this.pala2.bajar();

        // Seguir jugando hasta que las victorias de un jugador sea 3, mostrar resultado y opcion de jugar de nuevo
        if(this.victoriasJugador1 < 5 && this.victoriasJugador2 <5)
            elId = window.requestAnimationFrame(() =>{this.loop()});
        else if(this.victoriasJugador1 == 5){
            this.haGanado(svg,"JUGADOR 1");
            juegoNuevo.disabled = false; 
        }else if(this.victoriasJugador2 == 5){
            this.haGanado(svg,"JUGADOR 2");
            juegoNuevo.disabled = false;
        }
    }
}
export{Bola,Pala,Juego};