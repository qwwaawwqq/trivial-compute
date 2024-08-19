import { GameSession } from '../src/gamelogic/gameSession.js';
import { Player } from '../src/gamelogic/player.js';
import { Category } from '../src/gamelogic/category.js';
import { Board } from '../src/gamelogic/board.js';
import { Color } from '../src/gamelogic/color.js';
import { OpenEndedTextQuestion } from '../src/gamelogic/openEndedTextQuestion.js';

test('Create gameSession with 4 players and 4 categories without database integration', async () => {
    const playerNames = ["Abel", "Cain", "Abel2", "Cain2"];
    const categoryNames = ["Art & Literature", "Geography", "History", "Sports & Leisure"];
    
    const TOKEN_ORDER = [Color.RED, Color.YELLOW, Color.GREEN, Color.BLUE];
    const players = [];
    for (let i = 0; i < playerNames.length; i++) {
        const player = new Player(playerNames[i], TOKEN_ORDER[i]);
        players.push(player);
    }

    // Create categories using fake questions
    const CATEGORY_COLORS = [Color.YELLOW, Color.BLUE, Color.RED, Color.GREEN];
    const categories = {};
    for (let i = 0; i < categoryNames.length; i++) {
        let category = new Category(categoryNames[i]);
        const color = CATEGORY_COLORS[i];

        // Give each category one fake question
        const question = new OpenEndedTextQuestion(
            `What is ${i}?`,
            null, 
            null, 
            null, 
            null,
            `${i} is itself`
        )
        category.questions = [question];

        categories[color] = category;
    }

    const board = new Board();

    let game = new GameSession(board, categories, players);

    // TESTING CLASSES

    expect(game).toBeInstanceOf(GameSession); // Game is an object of GameSession Class.
    game.players.forEach(function(player, index) {
        expect(player).toBeInstanceOf(Player); // Check if each player was initialized as object of Player Class.
        expect(player.name).toBe(playerNames[index]); // Check if player object was made with correct name from playerNames array.
    })
    expect(game.GameSessionID).toBeDefined(); // Game Session ID was defined.

    let k = 0;
    CATEGORY_COLORS.forEach(function(color) {
        expect(categoryNames).toContain(game.categories[color].name) // Test if category names were properly initialized according to categoryNames array.
        
        let testQuestion = game.categories[color].pickRandomQuestion(); // Test random function for n=1 questions per category.
        expect(testQuestion.answer).toBe(`${k} is itself`); // Test if the answer was as defined above.
        k += 1;
        
        expect(testQuestion.toJSON()).toHaveProperty('typeOfQuestion');
        expect(testQuestion.toJSON()).toHaveProperty('dateCreated'); // Test if returning JSON has these four main properties.
        expect(testQuestion.toJSON()).toHaveProperty('creator');
        expect(testQuestion.toJSON()).toHaveProperty('answer');

    })
    expect(game.GameSessionID).toBeDefined(); 

    game = null;

    // console.log(game.toJSON());

});



test('Create gameSession with 1 player and 1 category without database integration + Long Names + Random UTF', async () => {
    const playerNames = ["AbelLongStringF4071012318StringFormatLong4071012318StringFormatԋ򏗚ψɼ򨺶㖹E񦰃P|샤%=􅓍򜄵򫖌*ݶ߂訠숼ĸҾݦ[ԋ򏗚ψɼ򨺶㖹E񦰃P|샤%=􅓍򜄵򫖌*ݶ߂訠숼ĸҾݦ[LongStringFormatLongStringFormatLongStringFormatLongStringFormat"];
    const categoryNames = ["Art & Literature LongStringFormatLongStringFormatLongStringFormatLongStringFormatLongStringFormatLongStringFormatLongStringFormatLongStringFormat"];
    
     
    const TOKEN_ORDER = [Color.RED];
    const players = [];
    for (let i = 0; i < playerNames.length; i++) {
        const player = new Player(playerNames[i], TOKEN_ORDER[i]);
        players.push(player);
    }

    // Create categories using fake questions
    const CATEGORY_COLORS = [Color.YELLOW];
    const categories = {};
    for (let i = 0; i < categoryNames.length; i++) {
        let category = new Category(categoryNames[i]);
        const color = CATEGORY_COLORS[i];

        // Give each category one fake question
        const question = new OpenEndedTextQuestion(
            `What is ${i}?`,
            null, 
            null, 
            null, 
            null,
            `${i} is itself`
        )
        category.questions = [question];

        categories[color] = category;
    }

    const board = new Board();

    let game = new GameSession(board, categories, players);

    // TESTING CLASSES

    expect(game).toBeInstanceOf(GameSession); // Game is an object of GameSession Class.
    game.players.forEach(function(player, index) {
        expect(player).toBeInstanceOf(Player); // Check if each player was initialized as object of Player Class.
        expect(player.name).toBe(playerNames[index]); // Check if player object was made with correct name from playerNames array.
    })
    expect(game.GameSessionID).toBeDefined(); // Game Session ID was defined.

    CATEGORY_COLORS.forEach(function(color, index) {
        expect(game.categories[color].name).toBe(categoryNames[index]); // Test if category names were properly initialized according to categoryNames array.
    })

    game = null;

    // console.log(game.toJSON());

});