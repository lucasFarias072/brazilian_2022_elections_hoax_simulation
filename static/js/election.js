

// Fotos de Lula e Bolsonaro
let lulaImg = document.querySelector('.lula-pict')
let bolsonaroImg = document.querySelector('.bolsonaro-pict')

// Seu nome
let person = document.querySelector('#person')

// Número do seu candidato
let voteInput = document.querySelector('#vote')

// Votar
let submitBtn = document.querySelector('.submit-btn')

// Números de cada voto (13, 22) (fraudado)
let votesBox = []

// Números de cada voto (13, 22) (não fraudado)
let realVotesBox = []

// Nome de cada eleitor
let voters = []

// Ambos dados acima mesclados (exibidos no console html do navegador em loop)
let mainReport = []

// Votos computados, votos para Lula, votos para Bolsonaro
let votesAmountDiv = document.querySelector('.overall-votes')
let bolsonaroDiv = document.querySelector('.bolsonaro-div')
let lulaDiv = document.querySelector('.lula-div')

// Voto computado com sucesso
let voteConfirmTag = document.querySelector('.vote-registered')

function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function changeBackground() {
    const changeBackgroundLoop = setInterval(() => {
        let changingValue = randomValue(1, 4)
        
        let directions = [
            "to top bottom", "to top left", "to top right",
            "to left top", "to left bottom", "to left right",
            "to right top", "to right bottom", "to right left"
        ]
        let direction = directions[randomValue(0, directions.length)]
        
        // I gave up using, but it can be applied
        let angle = `${randomValue(1, 90)}%`

        let colors = ["green", "yellow", "blue", "white", "green", "yellow", "blue", "green", "yellow"] 
        let colorA = colors[randomValue(0, colors.length)]
        let colorB = colors[randomValue(0, colors.length)]
        let colorC = colors[randomValue(0, colors.length)]

        if (changingValue == 1) {
            document.body.style.backgroundImage = `linear-gradient(${direction}, ${colorA}, ${colorB}, ${colorC})`;
        } else if (changingValue == 2) {
            document.body.style.backgroundImage = `linear-gradient(${direction}, ${colorB}, ${colorC}, ${colorA})`;
        } else if (changingValue == 3) {
            document.body.style.backgroundImage = `linear-gradient(${direction}, ${colorC}, ${colorA}, ${colorB})`;
        }
        
    }, 2000)
}

function monitorVar({targetVar}) {
    setInterval(() => {
        console.log('Var monitorada:', targetVar)
    }, 1500)
}

function monitorElement({element}) {
    setInterval(() => {
        console.log(element.value, typeof element.value)
    })
}

function watchNumber({element, imgTag}) {
    let politicians = {
        bolsonaro: imgTag[0],
        lula: imgTag[1]
    }
    
    setInterval(() => {
        switch(element.value) {
            case '13':
                setTimeout(() => {
                    // imgTag.attributes.src.value = politicians.image.lula
                    politicians.lula.classList.add('progressist')
                    politicians.bolsonaro.style.opacity = '.2'
                }, 500)
                break
            case '22':
                setTimeout(() => {
                    // imgTag.attributes.src.value = politicians.image.bolsonaro
                    politicians.bolsonaro.classList.add('republican')
                    politicians.lula.style.opacity = '.2'
                }, 500)
                break
            case '':
                // imgTag.attributes.src.value = ''
                politicians.lula.classList.remove('progressist')
                politicians.bolsonaro.classList.remove('republican')
                politicians.lula.style.opacity = '1'
                politicians.bolsonaro.style.opacity = '1'
                break
            default:
                // imgTag.attributes.src.value = ''
                politicians.lula.classList.remove('progressist')
                politicians.bolsonaro.classList.remove('republican')
                politicians.lula.style.opacity = '1'
                politicians.bolsonaro.style.opacity = '1'
                break
        }
    }, 1)
    
}

function showTempMsg({element, msg}) {
    element.textContent = msg
    setTimeout(() => {
        element.textContent = ''
    }, 2000)
}

function computeVote({elementVote, elementButton, elementPerson, realVoteChamber, fakeVoteChamber, whoVoted, reportChamber}) {
    elementButton.addEventListener('click', () => {
        
        if (elementVote.value === '22') {
            // Hacker: [0, 1, 2, 3] (25% de chance de roubar voto) (if 0: fraude) (else: normal)
            let hacker = Math.floor(Math.random() * 4 - 0)
            
            // Guardar voto: normal
            if (hacker != 0) {
                fakeVoteChamber.push(22)
                realVoteChamber.push(22)
            } 
            // Guardar voto: fraude
            else {
                fakeVoteChamber.push(13)
                realVoteChamber.push(22)
            }
            
            // capturar eleitor e guardar, mesclar ambos num único array
            whoVoted.push(elementPerson.value)
            reportChamber.push([elementPerson.value, 22])
            showTempMsg({element: voteConfirmTag, msg: 'Voto computado com sucesso'})

            // Limpar textos dos inputs de nome e voto
            elementPerson.value = ''
            elementVote.value = ''
            
            // localStorage.setItem('votesArray', JSON.stringify(container))
            // let votesArray = JSON.parse(localStorage.getItem('votesArray'))
            // window.location.reload()

        } else if (elementVote.value === '13') {
            // Guardar voto, capturar eleitor e guardar, mesclar ambos num único array
            fakeVoteChamber.push(13)
            realVoteChamber.push(13)
            whoVoted.push(elementPerson.value)
            reportChamber.push([elementPerson.value, 13])
            showTempMsg({element: voteConfirmTag, msg: 'Voto computado com sucesso'})
            
            // Limpar textos dos inputs de nome e voto
            elementPerson.value = ''
            elementVote.value = ''

            // localStorage.setItem('votesArray', JSON.stringify(container))
            // let votesArray = JSON.parse(localStorage.getItem('votesArray'))
            // window.location.reload()
        }  
    })
}

watchNumber(
    {
        element: voteInput,
        imgTag: [bolsonaroImg, lulaImg]
    })

computeVote(
    {
        elementVote: voteInput,
        elementButton: submitBtn,
        elementPerson: person,
        realVoteChamber: realVotesBox,
        fakeVoteChamber: votesBox, 
        whoVoted: voters,
        reportChamber: mainReport
    })

// Monitorar contagem dos votos no HTML
setInterval(() => {
    // Votos computados: int
    votesAmountDiv.textContent = votesBox.length  // votesAmountDiv.textContent = JSON.stringify(votesBox)

    // Contar qtd. de 22 e 13 dentro da var alvo "votesBox" separadamente
    let bolsonaroVotes = votesBox.filter(function(i) {return i === 22})
    let lulaVotes = votesBox.filter(function(i) {return i === 13})
    
    // Votos para Lula/Bolsonaro: int
    bolsonaroDiv.textContent = bolsonaroVotes.length
    lulaDiv.textContent = lulaVotes.length
    
    // Se há algum voto computado (começar a alterar porcentagens)
    if (votesBox.length >= 1) {
        // Luíz Inácio
        let lulaPercentage = document.querySelector('.lula-percentage')
        let lulaPercentageCalculus = (lulaVotes.length / votesBox.length) * 100
        lulaPercentage.textContent = `${parseFloat(lulaPercentageCalculus).toFixed(2)}%`
        lulaPercentage.style.width = `${lulaPercentage.textContent}`
        
        // Jair Bolsonaro
        let bolsonaroPercentage = document.querySelector('.bolsonaro-percentage')
        let bolsonaroPercentageCalculus = (bolsonaroVotes.length / votesBox.length) * 100
        bolsonaroPercentage.textContent = `${parseFloat(bolsonaroPercentageCalculus).toFixed(2)}%`
        bolsonaroPercentage.style.width = `${bolsonaroPercentage.textContent}`
    }

    // Array dos eleitores ['pessoa', voto] no console HTML (em loop) 
    // Inspecionar: (botão -> do mouse, inspecionar, selecionar aba "console")
    console.log(mainReport)
    
    // Conjunto de divs dentro da div com classe "real-data"
    let realDataBtnOn = document.querySelector('.real-data-show')
    let realDataBtnOff = document.querySelector('.real-data-hide')
    let bolsonaroRealVotesTag = document.querySelector('.bolsonaro-real-votes')
    let lulaRealVotesTag = document.querySelector('.lula-real-votes')
    
    // Ver dados reais
    realDataBtnOn.addEventListener('click', () => {
        let realDataLoop = setInterval(() => {
            let bolsonaroRealVotes = realVotesBox.filter(function(i) {return i === 22})
            let lulaRealVotes = realVotesBox.filter(function(i) {return i === 13})
            
            // Dados dos votos reais em comparação aos que aparecem na tela
            let realReport = {
                bolsonaro: `${bolsonaroRealVotes.length}`,
                lula: `${lulaRealVotes.length}`
            }
            
            // Dados dos votos reais sendo usados
            bolsonaroRealVotesTag.textContent = realReport.bolsonaro
            lulaRealVotesTag.textContent = realReport.lula
            
            // Esconder dados reais
            realDataBtnOff.addEventListener('click', () => {
                // Limpar dados (tags p somem do HTML, mas continuam atualizando via "realDataBtnOn")
                bolsonaroRealVotesTag.textContent = ''
                lulaRealVotesTag.textContent = ''
                // Para parar "Ver dados reais", o evento de clique que faz isso, deve estar dentro dele
                clearInterval(realDataLoop)
            })
        })
    })
}, 1000)

changeBackground()
