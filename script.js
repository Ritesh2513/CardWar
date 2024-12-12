// Card Class
class Card {
    constructor(numberValue, suit) {
        this.numberValue = numberValue;
        this.suit = suit;
    }

    getImagePath() {
        const valueNames = {
            2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'jack', 12: 'queen', 13: 'king', 14: 'ace'
        };
        const value = valueNames[this.numberValue];
        return `images/${value}_of_${this.suit}.png`;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        const suits = ["spades", "clubs", "hearts", "diamonds"];
        for (const suit of suits) {
            for (let value = 2; value <= 14; value++) {
                this.cards.push(new Card(value, suit));
            }
        }
    }

    shuffleDeck() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    dealCards(fromIndex, toIndex) {
        return this.cards.slice(fromIndex, toIndex);
    }
}


// Player Class
class Player {
    constructor(hand) {
        this.hand = hand;
        this.wonCards = [];
        this.roundsWon = 0; // Track rounds won
    }

    drawCard() {
        if (this.hand.length === 0 && this.wonCards.length > 0) {
            this.hand = this.wonCards;
            this.wonCards = [];
            this.shuffleHand();
        }
        return this.hand.length === 0 ? null : this.hand.shift();
    }
    
    shuffleHand() {
        this.hand.sort(() => Math.random() - 0.5);
    }
    

    addWonCards(cards) {
        this.wonCards.push(...cards);
    }

    hasCards() {
        return this.hand.length > 0;
    }

    getTotalCards() {
        return this.hand.length + this.wonCards.length;
    }
}

class Game {
    constructor() {
        const deck = new Deck();
        deck.shuffleDeck();
        this.player1 = new Player(deck.dealCards(0, 26));
        this.player2 = new Player(deck.dealCards(26, 52));
        this.warPile = [];
    }

    playRound() {
        const card1 = this.player1.drawCard();
        const card2 = this.player2.drawCard();

        if (card1 && card2) {
            console.log(`Player 1: ${card1.numberValue} of ${card1.suit}`);
            console.log(`Player 2: ${card2.numberValue} of ${card2.suit}`);
            if (card1.numberValue > card2.numberValue) {
                this.player1.addWonCards([card1, card2]);
                this.player1.roundsWon++;
            } else if (card2.numberValue > card1.numberValue) {
                this.player2.addWonCards([card1, card2]);
                this.player2.roundsWon++;
            } else {
                this.warPile.push(card1, card2);
                this.resolveWar();
            }
        } else {
            this.declareWinner();
        }

        document.getElementById('player1-rounds').innerText = this.player1.roundsWon;
        document.getElementById('player2-rounds').innerText = this.player2.roundsWon;
    }
    resolveWar() {
        if (!this.player1.hasCards() || !this.player2.hasCards()) {
            this.declareWinner();
            return;
        }
    
        for (let i = 0; i < 3; i++) {
            if (this.player1.hasCards()) this.warPile.push(this.player1.drawCard());
            if (this.player2.hasCards()) this.warPile.push(this.player2.drawCard());
            document.getElementById('war-pile').innerText = `War Pile: ${this.warPile.length} cards`;

        }
    
        const card1 = this.player1.drawCard();
        const card2 = this.player2.drawCard();
        if (card1 && card2) {
            this.warPile.push(card1, card2);
            if (card1.numberValue > card2.numberValue) {
                this.player1.addWonCards([...this.warPile]);
                this.player1.roundsWon++;
            } else if (card2.numberValue > card1.numberValue) {
                this.player2.addWonCards([...this.warPile]);
                this.player2.roundsWon++;
            } else {
                this.resolveWar(); // Recursion only if players still have cards
            }
        } else {
            this.declareWinner(); // Game ends if a player runs out of cards
        }
        this.warPile = [];
    }
    

    gameOver() {
        return !this.player1.hasCards() || !this.player2.hasCards();
    }

    declareWinner() {
        const messageElement = document.getElementById('winner-message');
        if (this.player1.roundsWon > this.player2.roundsWon) {
            messageElement.innerText = "Player 1 wins!";
        } else if (this.player2.roundsWon > this.player1.roundsWon) {
            messageElement.innerText = "Player 2 wins!";
        } else {
            messageElement.innerText = "It's a tie!";
        }
        messageElement.style.display = 'block';
    }
}

// Handling the UI and game interaction
document.getElementById('draw-button').addEventListener('click', drawCard);

const game = new Game();
function drawCard() {
    if (!game.gameOver()) {
        const card1 = game.player1.drawCard();
        const card2 = game.player2.drawCard();

        game.playRound();

        document.getElementById('player1-cards').style.backgroundImage = card1 ? `url(${card1.getImagePath()})` : 'none';
        document.getElementById('player2-cards').style.backgroundImage = card2 ? `url(${card2.getImagePath()})` : 'none';
    } else {
        game.declareWinner();
        document.getElementById('draw-button').disabled = true;
    }
}


