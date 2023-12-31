const game = (() => {
    const sceltePlayer = document.querySelector('.scelte-player');
    const versusPlayer = document.getElementById(101);
    const versusBotFacile = document.getElementById(102);
    const versusBotImpossible = document.getElementById(103);
    let player1, player2;
    let mosseDisponibiliGl = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let sceltaFlag; // flag per conservare la scelta tra contro player, contro Bot semplice o contro Bot impossible.
    let turnoAttuale = 1; // 1 primo giocatore , 2 secondo giocatore

    function addEventListeners() {
      // Event listener per la scelta del tipo di giocatore
      getControPlayer().addEventListener('click', giocatoreScelto);
      getControBotFacile().addEventListener('click', botFacileScelto);
      getControBotImpossibile().addEventListener('click', botImpossibileScelto);
  
      // Event listener per ogni casella del game board
      getCaselleBoard().forEach((casella) => {
        casella.addEventListener('click', (event) => {
          cambioDiTurno(event);
        });
      });
  
      // Event listener per i pulsanti di Nuovo Round e Nuova Partita
      getNuovaPartita().addEventListener('click', nuovaPartita);
      getNuovoRound().addEventListener('click', nuovoRound);
    }
    // Factory function per la creazione dell' oggetto giocatore
    const player = (nome, segno) => {
      const mosse = [];
      let punteggio = 0;
      let turno;
      return { nome , segno, mosse, punteggio, turno};
  };

    const nuovaPartita = () => {
      player1 = {};
      player2= {};
      mosseDisponibiliGl = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      
      modal = document.getElementById('modal');
      modal.style.display = 'none';

      getCaselleBoard().forEach((casella) => {
          casella.style.backgroundImage = 'none';
          casella.disabled = true;
      });
      
      aggiornaInterfaccia(player1, player2);

      riaggiungiPulsanti();
    }

    const nuovoRound = () => {
      player1.mosse = [];
      player2.mosse = [];
      mosseDisponibiliGl = [0, 1, 2, 3, 4, 5, 6, 7, 8];

      modal = document.getElementById('modal');
      modal.style.display = 'none';

      getCaselleBoard().forEach((casella) => {
          casella.style.backgroundImage = 'none';
          casella.disabled = false;
      });
    
      aggiornaInterfaccia(player1, player2);
    }
    // Gestione del cambio dei turni di gioco tenendo in considerazione 'sceltaFlag' ossia (flag per conservare la scelta tra contro player, contro Bot semplice o contro Bot impossible.)
    const cambioDiTurno = (event) => {
      if (sceltaFlag === 0) {
        gestionePulsantiBoard(event);
      } else if (sceltaFlag === 1) {
        gestionePulsantiBoard(event);
        if (turnoAttuale === 2) {
          mossaBotFacile();
        }
      } else if (sceltaFlag === 2) {
        gestionePulsantiBoard(event);
        if (turnoAttuale === 2) {
          mossaBotImpossibile();
        }
      }
    };

    function getControBotFacile () {
        const versusBotFacile = document.getElementById(102);
        return versusBotFacile;
    }

    function getControBotImpossibile () {
        const versusBotImpossible = document.getElementById(103);
        return versusBotImpossible;
    }

    function getControPlayer () {
        const versusPlayer = document.getElementById(101);
        return versusPlayer;
    }

    function getCaselleBoard () {
        const caselleBoard = document.querySelectorAll('.casella');
        return caselleBoard;
    }

    function getNuovoRound () {
        const nuovoRoundButton = document.getElementById('newRound-button');
        return nuovoRoundButton;
    }

    function getNuovaPartita () {
        const resetButton = document.getElementById('reset-button');
        return resetButton;
    }
    // Inizializzazione/Aggiornamento dell' interfaccia, tenendo in considerazione gli eventuali punti guadagnati nei precedenti rounds.
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
    // Attiva tutti i pulsanti della gameboard rendendola così cliccabile.
    function inizializzaGameBoard () {
        for (let i=0 ; i<9 ; i++) {
            let casellaBoard = document.getElementById(i);
            casellaBoard.disabled = false;
        }
    }
    // Rimuove dal DOM lo spazio dedito alla scelta dell'avversario (player, botSemplice, BotImpossibile).
    function eliminaSceltaPLayer (form) {
        const zonaSceltaPlayer = document.querySelector('.scelte-player')
        form.remove();
        zonaSceltaPlayer.remove();
    }
    // Estrae le informazioni inserite dall'utente per poi procedere ad una inizializzazione dell' interfaccia.
    function estraiInformazioniForm(form) {
        const formData = new FormData(form);
        const player1Name = formData.get('player1Name');
        const player1Symbol = formData.get('player1Symbol');
        let player2Name = formData.get('player2Name');

        if (sceltaFlag === 1 || sceltaFlag === 2) {
            player2Name = 'Bot';
        }
        const player2Symbol = (player1Symbol === 'X') ? 'O' : 'X';

         player1 = player(player1Name, player1Symbol);
         player2 = player(player2Name, player2Symbol);

        // flag per i turni di gioco
        player1.turno = 1;
        player2.turno = 2;
        
        aggiornaInterfaccia(player1, player2);
      }
    // Esegue un controllo della vittoria considerando tutte le possibili combinazioni vincenti, il controllo viene eseguito solo se il giocatore ha effettuato almeno 3 mosse.
    function controlloVittoria(giocatore) {
        const combinazioniVincenti = [
          [0, 1, 2], // Prima riga
          [3, 4, 5], // Seconda riga
          [6, 7, 8], // Terza riga
          [0, 3, 6], // Prima colonna
          [1, 4, 7], // Seconda colonna
          [2, 5, 8], // Terza colonna
          [0, 4, 8], // Prima diagonale
          [2, 4, 6]  // Seconda diagonale
        ];
        
        // Controllo solo dopo un numero minimo di mosse necessarie per vincere
        if (giocatore.mosse.length >= 3) {
            
            for (let combinazione of combinazioniVincenti) {
                
                let combinazioneVincenteTrovata = true;
                for (let mossa of combinazione) {

                  if (!giocatore.mosse.includes(mossa)) {
                    combinazioneVincenteTrovata = false;
                    break;
                  }
                }
                if (combinazioneVincenteTrovata) {
                  return true; // Il giocatore ha vinto
                }
              }
        }
        
        return false; // Nessuna combinazione vincente trovata
    }
    // Gestisce la mossa in se del giocatore/bot, inserisce il segno all' interno della casella ed aggiorna l' array delle mosse disponibili, controlla eventuale vittoria/pareggio.
    function gestioneTurniGiocatori (casella) {
        if (turnoAttuale === 1) {

            if (player1.segno === 'X') {
                casella.style.backgroundImage = 'url(./media/X.png)'
                casella.style.backgroundSize = '100% 100%'
            } else {
                casella.style.backgroundImage = 'url(./media/O.png)'
                casella.style.backgroundSize = '100% 100%'
            }

            player1.mosse.push(parseInt(casella.id));
            let index = mosseDisponibiliGl.indexOf(parseInt(casella.id));
            if (index > -1) {
                mosseDisponibiliGl.splice(index, 1);
            }

            if (controlloVittoria(player1)) {
                const modal = document.getElementById('modal');
                const winnerText = document.getElementById('winner-text');

                player1.punteggio+= 1;
                winnerText.textContent = `Vince ${player1.nome}!`;
                modal.style.display = 'flex';

                turnoAttuale =1; 
                
                return;
          
            }

            // Pareggio
            if (player1.mosse.length === 5 && player2.mosse.length === 4) {
            
                const modal = document.getElementById('modal');
                const winnerText = document.getElementById('winner-text');
                    

                winnerText.textContent = `Pareggio!`;
                modal.style.display = 'flex';
                turnoAttuale= 1;
                return;
            }
            
            turnoAttuale = 2;

        } else if (turnoAttuale === 2 ) {

            if (player2.segno === 'O') {
                casella.style.backgroundImage = 'url(./media/O.png)'
                casella.style.backgroundSize = '100% 100%'
            } else {
                casella.style.backgroundImage = 'url(./media/X.png)'
                casella.style.backgroundSize = '100% 100%'
            }

            player2.mosse.push(parseInt(casella.id));
            index = mosseDisponibiliGl.indexOf(parseInt(casella.id));
            if (index > -1) {
                mosseDisponibiliGl.splice(index, 1);
            }
            if (controlloVittoria(player2)) {
                const modal = document.getElementById('modal');
                const winnerText = document.getElementById('winner-text');
                
                player2.punteggio+= 1;
                winnerText.textContent = `Vince ${player2.nome}!`;
                modal.style.display = 'flex';
                
            }

            turnoAttuale = 1;
        }
        
    }

/* ------------------  Funzione modalità facile contro il bot (mosse random) ---------------- */
    function mossaBotFacile () {

        const randomIndex = Math.floor(Math.random() * mosseDisponibiliGl.length);
        const botMove = mosseDisponibiliGl[randomIndex];

        const botFacileCasella = document.getElementById(botMove.toString());
        botFacileCasella.click();

    }

/* ------------------ funzione modalità impossibile contro bot (mosse utilizzando l'algoritmo Minimax)  ----------- */
    function getMosseDisponibili () {
        return mosseDisponibiliGl.slice();
    }


    function minimax(giocatoreMax, giocatoreMin, mosseDisponibiliFor) {
      if (controlloVittoria(giocatoreMax)) {
        return 1; // Il giocatoreMax ha vinto
      } else if (controlloVittoria(giocatoreMin)) {
        return -1; // Il giocatoreMin ha vinto
      } else if (isPareggio(mosseDisponibiliFor)) {
        return 0; // Pareggio
      }
    
      let bestScore = -Infinity;
    
      for (let i = 0; i < mosseDisponibiliFor.length; i++) {
        const mossa = mosseDisponibiliFor[i];
        giocatoreMax.mosse.push(mossa);
        mosseDisponibiliFor.splice(i, 1);
    
        const score = -minimax(giocatoreMin, giocatoreMax, mosseDisponibiliFor);
    
        giocatoreMax.mosse.pop();
        mosseDisponibiliFor.splice(i, 0, mossa);
    
        bestScore = Math.max(bestScore, score);
      }
    
      return bestScore;
    }
    
    function mossaBotImpossibile() {
      const mosseDisponibili = getMosseDisponibili();
      let bestScore = -Infinity;
      let bestMove;
    
      for (let i = 0; i < mosseDisponibili.length; i++) {
        const mossa = mosseDisponibili[i];
        player2.mosse.push(mossa);
        mosseDisponibili.splice(i, 1);
    
        const score = -minimax(player1, player2, mosseDisponibili);
    
        player2.mosse.pop();
        mosseDisponibili.splice(i, 0, mossa);
    
        if (score > bestScore) {
          bestScore = score;
          bestMove = mossa;
        }
      }
    
      const botImpossibileCasella = document.getElementById(bestMove.toString());
      botImpossibileCasella.click();
      
    }
      // Restituisce true se la partita è in pareggio, false altrimenti
      function isPareggio(mosseDisponibiliFor) {
        return mosseDisponibiliFor.length === 0;
      }

      /* ---------------------------------------- */

    function gestionePulsantiBoard (event) {
        const casella = event.target;
        
        casella.disabled = true;
        gestioneTurniGiocatori (casella);

    }

    function riaggiungiPulsanti () {
        main = document.getElementById('mainContainer')

        main.appendChild(sceltePlayer);
        sceltePlayer.appendChild(versusPlayer);
        sceltePlayer.appendChild(versusBotFacile);
        sceltePlayer.appendChild(versusBotImpossible);
    }

    function giocatoreScelto() {
        // Rimuovi i pulsanti
        versusPlayer.remove();
        versusBotFacile.remove();
        versusBotImpossible.remove();
    
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column'; 

        // Crea il primo input di testo per il nome del player 1
        let player1Label = document.createElement('label');
        player1Label.innerText = "Nome Giocatore 1:";
        form.appendChild(player1Label);
        
        let player1Input = document.createElement('input');
        player1Input.type = 'text';
        player1Input.name = 'player1Name';
        player1Input.setAttribute('required', 'true');
        player1Input.setAttribute('autocomplete', 'off');
        form.appendChild(player1Input);
        
        // Crea il secondo input di testo per il nome del player 2
        let player2Label = document.createElement('label');
        player2Label.innerText = "Nome Giocatore 2:";
        form.appendChild(player2Label);
        
        let player2Input = document.createElement('input');
        player2Input.type = 'text';
        player2Input.name = 'player2Name';
        player2Input.setAttribute('required', 'true');
        player2Input.setAttribute('autocomplete', 'off');
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
        submitButton.value = 'Start';
        submitButton.setAttribute('target', '_blank');
        submitButton.setAttribute('id' , 'inizia');
        form.appendChild(submitButton);

        sceltaFlag = 0;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            ////////////////////////////////////////////sceltaFlag = 0;
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
        
        sceltePlayer.appendChild(form);
    }

    function botFacileScelto() {
        sceltaFlag = 1;
        // Rimuovi i pulsanti
        versusPlayer.remove();
        versusBotFacile.remove();
        versusBotImpossible.remove();
    
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column'; 

        // Crea il primo input di testo per il nome del player 1
        let player1Label = document.createElement('label');
        player1Label.innerText = "Nome Giocatore:";
        form.appendChild(player1Label);
        
        let player1Input = document.createElement('input');
        player1Input.type = 'text';
        player1Input.name = 'player1Name';
        player1Input.setAttribute('required', 'true');
        player1Input.setAttribute('autocomplete', 'off');
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
        submitButton.value = 'Inizia';
        submitButton.setAttribute('target', '_blank');
        submitButton.setAttribute('id' , 'inizia');
        form.appendChild(submitButton);

        
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
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
        
        sceltePlayer.appendChild(form);
        sceltaFlag = 1;

    }

    function botImpossibileScelto () {
        sceltaFlag = 2;
        // Rimuovi i pulsanti

        versusPlayer.remove();
        versusBotFacile.remove();
        versusBotImpossible.remove();
    
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column'; 

        // Crea il primo input di testo per il nome del player 1
        let player1Label = document.createElement('label');
        player1Label.innerText = "Nome Giocatore:";
        form.appendChild(player1Label);
        
        let player1Input = document.createElement('input');
        player1Input.type = 'text';
        player1Input.name = 'player1Name';
        player1Input.setAttribute('required', 'true');
        player1Input.setAttribute('autocomplete', 'off');
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
        submitButton.value = 'Start';
        submitButton.setAttribute('target', '_blank');
        submitButton.setAttribute('id' , 'inizia');
        form.appendChild(submitButton);

        
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
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
        
        sceltePlayer.appendChild(form);
        sceltaFlag = 2;

    }
    
    addEventListeners();
    
})();



