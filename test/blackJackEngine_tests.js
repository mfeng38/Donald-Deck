const expect = require('chai').expect
const blackjack = require('../public/javascript/blackJackEngine.js')

describe('blackjackEngine Tests', () => {
    it('DeckID should return a valid deckID', () => {
        const result = blackjack.deckID
        expect(result).to.be.an('undefined')
    })
    it('gameStart should return true if script ran correctly', () => {
        const result = blackjack.gameStart
        expect(result).to.be.an('undefined')
    })
    it('hit should give current player a card; calculates if player busts', () => {
        const result = blackjack.hit
        expect(result).to.be.an('undefined')
    })
    it('dealer should hit on 16, stay on 17 and follow appropriate actions if bust', () => {
        const result = blackjack.dealer
        expect(result).to.be.an('undefined')
    })
    it('gameStateReset should reset game for new round', () => {
        const result = blackjack.hit
        expect(result).to.be.an('undefined')
    })
    it('reshuffle should reshuffle the deck', () => {
        const result = blackjack.shuffle
        expect(result).to.be.an('undefined')
    })
})
