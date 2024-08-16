import { GameSession } from '../src/gamelogic/gameSession.js';
import { Player } from '../src/gamelogic/player.js';
import { Category } from '../src/gamelogic/category.js';
import { Board } from '../src/gamelogic/board.js';
import { Color } from '../src/gamelogic/color.js';
import { OpenEndedTextQuestion } from '../src/gamelogic/openEndedTextQuestion.js';

test('Create gameSession with 4 players and 4 categories without database integration', () => {
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

    console.log(game.toJSON());

})