let player1, player2;

const game = (() => {
    
    let sceltaFlag = 0;
  
    function aggiornaInterfaccia (player1, player2) {
        const player1Name = document.getElementById('player1Name');
        const player1Points = document.getElementById('player1Points');

        const player2Name = document.getElementById('player2Name');
        const player2Points = document.getElementById('player2Points');

        player1Name.textContent = player1.nome;
        player1Points.textContent = player1.punteggio;

        player2Name.textContent = player2.nome;
        player2Points.textContent = player2.punteggio;
    }

    function inizializzaGameBoard () {
        for (let i=0 ; i<9 ; i++) {
            let casellaBoard = document.getElementById(i);
            casellaBoard.disabled = false;
        }
    }

    function eliminaSceltaPLayer (form) {
        const zonaSceltaPlayer = document.querySelector('.scelte-player')
        form.remove();
        zonaSceltaPlayer.remove();
    }

    function estraiInformazioniForm(form) {
        const formData = new FormData(form);
        const player1Name = formData.get('player1Name');
        const player1Symbol = formData.get('player1Symbol');
        let player2Name = formData.get('player2Name');

        if (sceltaFlag === 1) {
            player2Name = 'Bot';
        }
        const player2Symbol = (player1Symbol === 'X') ? 'O' : 'X';

        player1 = player(player1Name, player1Symbol);
        player2 = player(player2Name, player2Symbol);

        // flag per i turni di gioco
        player1.turno = true;
        player2.turno = false;
        
        aggiornaInterfaccia(player1, player2);
      }

    const player = (nome, segno) => {
        const mosse = [];
        let punteggio = 0;
        let turno;
        return { nome , segno, mosse, punteggio, turno};
    };

    function controRobot () {
        const versusBot = document.getElementById(102);
        return versusBot;
    }

    function controPlayer () {
        const versusPlayer = document.getElementById(101);
        return versusPlayer;
    }

    const sceltePlayer = document.querySelector('.scelte-player');
    const versusPlayer = document.getElementById(101);
    const versusBot = document.getElementById(102);

    function giocatoreScelto() {
        // Rimuovi i pulsanti
        versusPlayer.remove();
        versusBot.remove();
    
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column'; 

        // Crea il primo input di testo per il nome del player 1
        let player1Label = document.createElement('label');
        player1Label.innerText = "Nome Player 1:";
        form.appendChild(player1Label);
        
        let player1Input = document.createElement('input');
        player1Input.type = 'text';
        player1Input.name = 'player1Name';
        player1Input.setAttribute('required', 'true');
        form.appendChild(player1Input);
        
        // Crea il secondo input di testo per il nome del player 2
        let player2Label = document.createElement('label');
        player2Label.innerText = "Nome Player 2:";
        form.appendChild(player2Label);
        
        let player2Input = document.createElement('input');
        player2Input.type = 'text';
        player2Input.name = 'player2Name';
        player2Input.setAttribute('required', 'true');
        form.appendChild(player2Input);
        
        // Crea il div per i radio button del segno del player 1
        let symbolDiv = document.createElement('div');
        
        let symbolLabel = document.createElement('label');
        symbolLabel.innerText = "Segno Player 1:";
        symbolDiv.appendChild(symbolLabel);
        
        let symbolXInput = document.createElement('input');
        symbolXInput.type = 'radio';
        symbolXInput.name = 'player1Symbol';
        symbolXInput.value = 'X';
        symbolXInput.setAttribute('required', 'true');
        symbolDiv.appendChild(symbolXInput);
        
        let symbolXLabel = document.createElement('label');
        symbolXLabel.innerText = "X";
        symbolDiv.appendChild(symbolXLabel);
        
        let symbolOInput = document.createElement('input');
        symbolOInput.type = 'radio';
        symbolOInput.name = 'player1Symbol';
        symbolOInput.value = 'O';
        symbolOInput.setAttribute('required', 'true');
        symbolDiv.appendChild(symbolOInput);
        
        let symbolOLabel = document.createElement('label');
        symbolOLabel.innerText = "O";
        symbolDiv.appendChild(symbolOLabel);
        
        form.appendChild(symbolDiv);
        
        // Crea il pulsante di submit
        let submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = 'Invia';
        submitButton.setAttribute('target', '_blank');
        form.appendChild(submitButton);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
      
            // Estrai le informazioni dal form
            estraiInformazioniForm(form);

            // Inizializzazione tabelle punti
            aggiornaInterfaccia(player1, player2);

            // Attiva i pulsanti
            inizializzaGameBoard();
      
      
            // Resetta il form
            form.reset();
            eliminaSceltaPLayer (form);
          });
        
        // Aggiungi il form alla posizione desiderata nel documento
        sceltePlayer.appendChild(form);
    }

    function botScelto() {
        // Rimuovi i pulsanti
        versusPlayer.remove();
        versusBot.remove();
    
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column'; 

        // Crea il primo input di testo per il nome del player 1
        let player1Label = document.createElement('label');
        player1Label.innerText = "Nome Player 1:";
        form.appendChild(player1Label);
        
        let player1Input = document.createElement('input');
        player1Input.type = 'text';
        player1Input.name = 'player1Name';
        player1Input.setAttribute('required', 'true');
        form.appendChild(player1Input);
        
        // Crea il div per i radio button del segno del player 1
        let symbolDiv = document.createElement('div');
        
        let symbolLabel = document.createElement('label');
        symbolLabel.innerText = "Segno Player 1:";
        symbolDiv.appendChild(symbolLabel);
        
        let symbolXInput = document.createElement('input');
        symbolXInput.type = 'radio';
        symbolXInput.name = 'player1Symbol';
        symbolXInput.value = 'X';
        symbolXInput.setAttribute('required', 'true');
        symbolDiv.appendChild(symbolXInput);
        
        let symbolXLabel = document.createElement('label');
        symbolXLabel.innerText = "X";
        symbolDiv.appendChild(symbolXLabel);
        
        let symbolOInput = document.createElement('input');
        symbolOInput.type = 'radio';
        symbolOInput.name = 'player1Symbol';
        symbolOInput.value = 'O';
        symbolOInput.setAttribute('required', 'true');
        symbolDiv.appendChild(symbolOInput);
        
        let symbolOLabel = document.createElement('label');
        symbolOLabel.innerText = "O";
        symbolDiv.appendChild(symbolOLabel);
        
        form.appendChild(symbolDiv);
        
        // Crea il pulsante di submit
        let submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = 'Invia';
        submitButton.setAttribute('target', '_blank');
        form.appendChild(submitButton);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
            sceltaFlag = 1;
            // Estrai le informazioni dal form
            estraiInformazioniForm(form);
      
            // Inizializzazione tabelle punti
            aggiornaInterfaccia(player1, player2);

            // Attiva i pulsanti
            inizializzaGameBoard ()
      
            // Resetta il form
            form.reset();
            eliminaSceltaPLayer (form);
          });
        
        // Aggiungi il form alla posizione desiderata nel documento
        sceltePlayer.appendChild(form);
    }


    return {
        player ,
        controRobot ,
        controPlayer ,
        giocatoreScelto,
        botScelto ,
    };
})();

game.controPlayer().addEventListener('click', game.giocatoreScelto);

game.controRobot().addEventListener('click' , game.botScelto);