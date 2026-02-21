// Selecionando elementos do DOM
const cv = document.getElementById("canva")
const ctx = cv.getContext("2d")
const colorPicker = document.getElementById("colorPicker")
const SizePicker = document.getElementById("brushSize")

// Variáveis iniciais
let color = "#000000"
let brushSize = 5
let isDrawing = false
let erase = false
let prevData= "";
 // Definindo o tamanho do canvas com base no tamanho da janela
cv.width = window.innerWidth * 0.8;
cv.height = window.innerHeight * 0.9;

// Configuração do pincel 
// Isso garante que as pontas das linhas sejam arredondadas, criando o efeito de pincel
ctx.lineCap = "round"
// Isso garante que as junções (quando a linha muda de direção) também sejam suaves
ctx.lineJoin = "round"

//Eventos
// Mudando a cor do pincel conforme a seleção do usuário
colorPicker.addEventListener("change", (e) => {
    color = e.target.value
    colorPicker.style.backgroundColor = color
})

// Mudando o tamanho do pincel conforme a seleção do usuário
SizePicker.addEventListener("change", (e) => {
    brushSize = e.target.value
    document.getElementById("sizeLabel").innerHTML = brushSize
})
// Alternar entre modo de apagar e modo de desenhar
function isErase(value){
    erase = value
    if(erase){
        document.getElementById("erase").className = "btn-light"
        document.getElementById("brush").className = ""
    }else{
        document.getElementById("brush").className = "btn-light"
        document.getElementById("erase").className = ""
    }
    
}

// Pintura no canvas
function drawMouse(e) {
    if(isDrawing){
        if(erase){
            ctx.strokeStyle = "#FFFFFF"
        }
        else{
            ctx.strokeStyle = color
        }
        ctx.lineWidth = brushSize
        const x = e.clientX - cv.offsetLeft
        const y = e.clientY - cv.offsetTop
        ctx.lineTo(x, y)
        ctx.stroke()
        
        
    }
}
function drawTouch(e){
    if(isDrawing){
        if(erase){
            ctx.strokeStyle = "#FFFFFF"
        }
        else{
            ctx.strokeStyle = color
        }
        ctx.lineWidth = brushSize
        const touch = e.touches ? e.touches[0] : e
        const x = touch.clientX - cv.offsetLeft
        const y = touch.clientY - cv.offsetTop
        ctx.lineTo(x, y)
        ctx.stroke()
        
}}
// Iniciar desenho
function startDraw(e){
 prevData = cv.toDataURL("image/png")// Salvar estado atual para desfazer
    isDrawing = true
    // Iniciar um novo caminho de desenho
    ctx.beginPath() 
}

//Finalizar desenho
function finishDraw(e){
    if(isDrawing){
    isDrawing = false
    ctx.stroke()
    ctx.closePath()
    localStorage.setItem("data", cv.toDataURL("image/png"));// Salvar o estado atual do canvas no localStorage
    }
}
// Evento começa ao pressionar o mouse
cv.addEventListener("mousedown", startDraw)
// Evento de movimento do mouse para desenhar
cv.addEventListener("mousemove", drawMouse)
// Evento termina ao soltar o mouse
cv.addEventListener("mouseup", finishDraw)
cv.addEventListener("mouseout", finishDraw)
// Evento começa ao pressionar na tela
cv.addEventListener("touchstart", startDraw)
// Evento de movimento do dedo para desenhar
cv.addEventListener("touchmove", drawTouch)
// Evento termina de pressionar a tela
cv.addEventListener("touchend", finishDraw)
cv.addEventListener("touchcancel", finishDraw)




//Download canva
function saveCanva(){
    const dataURL = cv.toDataURL("image/png")
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas.png';
    a.click();
    document.body.removeChild(a);
}

//Limpar canva
function cleanCanva(){
    if(confirm("Clear the canvas?")){
    ctx.clearRect(0,0, cv.width, cv.height)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, cv.width, cv.height)
    prevData = "";
    localStorage.removeItem("data")
    }
}
//Carregando localstorage
function loadData(){
    const data = localStorage.getItem("data")
    //Se tiver dados, carrega a imagem no canvas
    if(data){
        const img = new Image()
        img.onload = function() {
            ctx.drawImage(img, 0, 0)
        }
        img.src = data
    }
    //Se não tiver dados, cria um canvas branco
    else{
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, cv.width, cv.height)
    }
}
//Desfazendo desenho
function undo(){
    const data = prevData;
    if(data){
        const img = new Image()
        img.onload = function() {
            ctx.drawImage(img, 0, 0)
        }
        img.src = data
        prevData = localStorage.getItem("data");
        localStorage.setItem("data", data);
    }
}
//Inicializando
loadData()

