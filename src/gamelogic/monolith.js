// Please split this into multiple files, I just don't know how yet lol

import { Enum } from 'enumify';

// TODO For simplicity I assume we pull all the questions at once.
// Alternate approach: pull questions randomly from the category when they're asked for?
// so only store the number of questions in each category in the server for example.

// TODO add non-game parts (i.e. account/question/category features)
// TODO include validation/exception handling?
// TODO what parses requests to the server?
// TODO add feature to continue game later? GameSession already has enough information for this.

class Color extends Enum {}
Color.initEnum(['RED', 'GREEN', 'BLUE', 'YELLOW', 'WHITE']);

class QuestionType extends Enum {}
QuestionType.initEnum(['TEXT', 'IMAGE', 'AUDIO', 'VIDEO']);

class PageState extends Enum {}
PageState.initEnum([
    'HOME_SCREEN',
    'GAME_CONFIG_SCREEN',
    'GAME_SCREEN_ROLL_DIE',
    'GAME_SCREEN_SELECT_SQUARE',
    'CENTER_SQUARE_CATEGORY_POPUP',
    'TEXT_QUESTION_POPUP',
    'IMAGE_QUESTION_POPUP',
    'VIDEO_QUESTION_POPUP',
    'AUDIO_QUESTION_POPUP',
    'AUTHENTICATION_SCREEN',
    'ACCOUNT_MANAGER_SCREEN',
    'CATEGORY_MANAGER_SCREEN',
    'QUESTION_MANAGER_SCREEN',
    'QUESTION_MODIFY_TEXT_POPUP',
    'QUESTION_MODIFY_MEDIA_POPUP'
]);

class Die {
    constructor() {
        // A die can be rolled to generate a random number.
    }

    roll(low = 1, high = 6) {
        // Return a randomly generated integer in the range between inputs low to high inclusive.
        return Math.floor(Math.random() * high) + low;
    }
}

class QuestionStats {
    constructor(questionStatsJSON) {
        // QuestionStats keeps track of times asked and times correctly answered.
        // Populates fields from JSON retrieved from the database.
        this.timesAsked = questionStatsJSON["TimesAsked"];
        this.timesCorrectlyAnswered = questionStatsJSON["CorrectlyAnswered"];
    }
}

class Question {
    constructor(questionJSON) {
        // Populates fields from JSON retrieved from the database.
        // Enforces that JSON contents are valid.
        this.fromJSON(questionJSON);
    }

    fromJSON(questionJSON) {
        this.questionText = questionJSON["QuestionText"];
        this.usageStatistics = new QuestionStats(questionJSON["UsageStatistics"]);
        this.typeOfQuestion = QuestionType.enumValueOf(questionJSON["TypeOfQuestion"].toUpperCase());
        this.fileLocation = questionJSON["FileLocation"];
        this.answer = questionJSON["Answer"];
        this.json = questionJSON;
    }

    toJSON() {
        return this.json;
    }
}

class Category {
    constructor(name, questions) {
        this.name = name;
        this.questions = questions;
    }

    pickRandomQuestion() {
        return this.questions[randomInt(0, this.questions.length)];
    }
}

class Square {
    constructor(color, isHQ = false, isCenter = false, isRollAgain = false) {
        this.color = color;
        this.isHQ = isHQ;
        this.isCenter = isCenter;
        this.isRollAgain = isRollAgain;
    }
}

class Board {
    constructor(arrayJSON) {
        // A location on the board is specified as a row and a column, both of which are integers.
        // The array is essentially a lookup for a square at a location.
        this.array = arrayJSON;
    }

    hasLocation(row, column) {
        // Verify that this board has a square at the provided row/column location.
        return this.array[row] && this.array[row][column];
    }

    getSquare(row, column) {
        // Preconditions: The given location is in the board.
        return this.array[row][column];
    }

    calculateNextSteps(row, column, roll) {
        // Calculate possible next locations.
        let locationsInRange = [];
        for (let offset = 0; offset < roll; offset++) {
            locationsInRange.push([row + offset, column + roll - offset]);
            locationsInRange.push([row + roll - offset, column - offset]);
            locationsInRange.push([row - offset, column - (roll - offset)]);
            locationsInRange.push([row - (roll - offset), column + offset]);
        }

        let possibleLocations = [];
        for (let location of locationsInRange) {
            if (this.hasLocation(location[0], location[1])) {
                possibleLocations.push(location);
            }
        }

        return possibleLocations;
    }
}

class Player {
    constructor(name, tokenColor, score, row = 4, column = 4, userUUID = null) {
        this.name = name;
        this.tokenColor = tokenColor;
        this.score = score;
        this.row = row;
        this.column = column;
        this.userUUID = userUUID;
    }

    setLocation(row, column) {
        this.row = row;
        this.column = column;
    }

    awardPoint(color) {
        this.score[color] = true;
    }

    isWinner() {
        let points = 0;
        for (let color in this.score) {
            if (this.score[color]) {
                points++;
            }
        }
        return points >= 4;
    }
}

class GameSession {
    constructor(categories, numPlayers, players, currentPlayer, currentPlayerIndex, board, pageState) {
        // Assume for now that the order of players is always the order of inputs from the Game Creation screen.
        this.categories = categories;
        this.numPlayers = numPlayers;
        this.players = players;
        this.currentPlayer = currentPlayer;
        this.currentPlayerIndex = currentPlayerIndex;
        this.currentQuestion = null;
        this.currentSquare = null;
        this.board = board;
        this.pageState = pageState;
    }

    goToNextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.numPlayers;
        this.currentPlayer = this.players[this.currentPlayerIndex];
    }

    toJSON() {
        return {
            categories: this.categories,
            numPlayers: this.numPlayers,
            players: this.players,
            currentPlayer: this.currentPlayer,
            currentPlayerIndex: this.currentPlayerIndex,
            currentQuestion: this.currentQuestion,
            currentSquare: this.currentSquare,
            board: this.board
        };
    }
}

class Database {
    /**
     * Boundary object for the database.
     */
    constructor() {
        // do we need a key or something to access this?
    }

    static _MOCK_DATABASE = {
        "Categories": {
            "Geography": [
                {
                    "QuestionUniqueID": "unique_id_1",
                    "DateCreated": "YYYY-MM-DD",
                    "DifficultyLevel": "easy",
                    "UsageStatistics": {
                        "TimesAsked": 10,
                        "CorrectAnswerPercentage": 70
                    },
                    "Creator": "creator_name",
                    "Answer": "answer_text",
                    "TypeOfQuestion": "text",
                    "TextDetails": {
                        "Question": "What is the capital of France?",
                        "TextType": "multiple_choice"
                    }
                }
            ],
            "Art_Literature": [
                {
                    "QuestionUniqueID": "unique_id_2",
                    "DateCreated": "YYYY-MM-DD",
                    "DifficultyLevel": "medium",
                    "UsageStatistics": {
                        "TimesAsked": 5,
                        "CorrectAnswerPercentage": 60
                    },
                    "Creator": "creator_name",
                    "Answer": "answer_text",
                    "TypeOfQuestion": "audio",
                    "FileLocation": "firebase_storage_location"
                }
            ],
            "Science_Nature": [
                {
                    "QuestionUniqueID": "unique_id_3",
                    "DateCreated": "YYYY-MM-DD",
                    "DifficultyLevel": "hard",
                    "UsageStatistics": {
                        "TimesAsked": 8,
                        "CorrectAnswerPercentage": 50
                    },
                    "Creator": "creator_name",
                    "Answer": "answer_text",
                    "TypeOfQuestion": "image",
                    "FileLocation": "firebase_storage_location"
                }
            ],
            "History": [
                {
                    "QuestionUniqueID": "unique_id_4",
                    "DateCreated": "YYYY-MM-DD",
                    "DifficultyLevel": "easy",
                    "UsageStatistics": {
                        "TimesAsked": 12,
                        "CorrectAnswerPercentage": 80
                    },
                    "Creator": "creator_name",
                    "Answer": "answer_text",
                    "TypeOfQuestion": "video",
                    "FileLocation": "firebase_storage_location"
                }
            ],
            "Sport_Leisure": [
                {
                    "QuestionUniqueID": "unique_id_5",
                    "DateCreated": "YYYY-MM-DD",
                    "DifficultyLevel": "medium",
                    "UsageStatistics": {
                        "TimesAsked": 15,
                        "CorrectAnswerPercentage": 65
                    },
                    "Creator": "creator_name",
                    "Answer": "answer_text",
                    "TypeOfQuestion": "text",
                    "TextDetails": {
                        "Question": "Who won the World Cup in 2018?",
                        "TextType": "open_ended"
                    }
                }
            ]
        },
        "Users": {
            "user_uuid_1": {
                "Name": "John Doe",
                "Email": "john.doe@example.com",
                "Grade": "A",
                "GameHistory": {
                    "GamesPlayed": 10,
                    "WinLossRecord": {
                        "Wins": 6,
                        "Losses": 4
                    }
                },
                "AchievementTracking": {
                    "Achievements": [
                        "First Win",
                        "High Score"
                    ]
                }
            }
        },
        "GameSessions": [
            {
                "Timestamp": "YYYY-MM-DDTHH:MM:SSZ",
                "GameSessionID": "game_session_id_1",
                "ParticipatingPlayers": [
                    "user_id_1",
                    "user_id_2"
                ],
                "CurrentGameState": {
                    "BoardConfiguration": "board_config",
                    "PlayerPositions": {
                        "user_id_1": "position_1",
                        "user_id_2": "position_2"
                    },
                    "Scores": {
                        "user_id_1": 50,
                        "user_id_2": 40
                    }
                },
                "GameSettings": {
                    "NumberOfQuestions": 20,
                    "CategoriesInPlay": [
                        "Geography",
                        "Science_Nature"
                    ],
                    "CustomRules": "no_rules"
                },
                "ChatLogs": [
                    {
                        "UserID": "user_id_1",
                        "Message": "Good luck!"
                    }
                ],
                "QuestionIDList": [
                    "unique_id_1",
                    "unique_id_3"
                ]
            }
        ],
        "Board": {
            0: {
                0: { "color": Color.WHITE, "is_roll_again": true },
                1: { "color": Color.YELLOW },
                2: { "color": Color.BLUE },
                3: { "color": Color.GREEN },
                4: { "color": Color.RED, "is_HQ": true },
                5: { "color": Color.YELLOW },
                6: { "color": Color.BLUE },
                7: { "color": Color.GREEN },
                8: { "color": Color.WHITE, "is_roll_again": true },
            },
            1: {
                0: { "color": Color.RED },
                4: { "color": Color.YELLOW },
                8: { "color": Color.RED },
            },
            2: {
                0: { "color": Color.GREEN },
                4: { "color": Color.BLUE },
                8: { "color": Color.YELLOW },
            },
            3: {
                0: { "color": Color.BLUE },
                4: { "color": Color.GREEN },
                8: { "color": Color.BLUE },
            },
            4: {
                0: { "color": Color.YELLOW, "is_HQ": true },
                1: { "color": Color.BLUE },
                2: { "color": Color.GREEN },
                3: { "color": Color.RED },
                4: { "color": Color.WHITE, "is_center": true },
                5: { "color": Color.BLUE },
                6: { "color": Color.YELLOW },
                7: { "color": Color.RED },
                8: { "color": Color.GREEN, "is_HQ": true },
            },
            5: {
                0: { "color": Color.RED },
                4: { "color": Color.YELLOW },
                8: { "color": Color.RED },
            },
            6: {
                0: { "color": Color.GREEN },
                4: { "color": Color.RED },
                8: { "color": Color.YELLOW },
            },
            7: {
                0: { "color": Color.BLUE },
                4: { "color": Color.GREEN },
                8: { "color": Color.BLUE },
            },
            8: {
                0: { "color": Color.WHITE, "is_roll_again": true },
                1: { "color": Color.YELLOW },
                2: { "color": Color.RED },
                3: { "color": Color.GREEN },
                4: { "color": Color.BLUE, "is_HQ": true },
                5: { "color": Color.YELLOW },
                6: { "color": Color.RED },
                7: { "color": Color.GREEN },
                8: { "color": Color.WHITE, "is_roll_again": true },
            },
        }
    };

    getQuestions(categoryName) {
        /**
         * Presumably this would be a Firebase request.
         * Assume the return format is this JSON object:
         * [
         *   {
         *     # question 1
         *   },
         *   {
         *     # question 2
         *   },
         *   ...
         * ]
         */
        return Database._MOCK_DATABASE["Categories"][categoryName];
    }

    getBoard() {
        /**
         * Assume the return format is this JSON object:
         * {
         *   0: {
         *     0: {"color": ???, <other properties>},
         *     ...
         *   },
         *   ...
         * }
         * Assume some Firebase logic goes here that gets the actual board.
         * Assume the board is stored in this dict[int, dict[int, Square]] form, where Square has been JSON-serialized recursively.
         */
        return Database._MOCK_DATABASE["Board"];
    }
    
    // getCategories() {
    //     // Assume some Firebase logic goes here that gets the actual categories.
    //     // Assume Categories and Questions are JSON-serialized in a manner that is easy to take out.
    //     return Object.keys(Database._MOCK_DATABASE["Categories"]);
    // }
}

class Server {
    /**
     * Singleton object containing globally scoped objects.
     */
    constructor(database, gameSession = null) {
        this.database = database;
        this.die = new Die();
        this.gameSession = gameSession;
    }

    // PRIVATE

    _validateStartInputs(categoryNames, playerNames) {
        // Check number of players?
        // Check player name types maybe?
        // Does any check need to happen for categories?
    }

    _askQuestion(category) {
        const question = category.pickRandomQuestion();
        this.gameSession.currentQuestion = question;
        this.gameSession.currentSquare = category;
        return [PageState.GAME_SCREEN_ROLL_DIE, question];
    }

    startGame(categoryNames, playerNames) {
        /**
         * Define Game and retrieve Board.
         */
        try {
            this._validateStartInputs(categoryNames, playerNames);
        } catch {
            return [PageState.GAME_CONFIG_SCREEN, null];
        }

        const CATEGORY_COLORS = [Color.YELLOW, Color.BLUE, Color.RED, Color.GREEN];
        const categories = {};

        for (let i = 0; i < 4; i++) {
            const categoryColor = CATEGORY_COLORS[i];
            const categoryName = categoryNames[i];
            const questions = [];
            const questionJsons = this.database.getQuestions(categoryName);

            for (const questionJson of questionJsons) {
                questions.push(new Question(questionJson));
            }

            categories[categoryColor] = new Category(categoryName, questions);
        }

        const TOKEN_COLORS = [Color.RED, Color.YELLOW, Color.GREEN, Color.BLUE];
        const numPlayers = playerNames.length;
        const players = [];

        for (let i = 0; i < numPlayers; i++) {
            const tokenColor = TOKEN_COLORS[i];
            const playerName = playerNames[i];
            players.push(new Player(
                playerName,
                tokenColor,
                {
                    [Color.RED]: false,
                    [Color.BLUE]: false,
                    [Color.GREEN]: false,
                    [Color.YELLOW]: false,
                },
                4,
                4
            ));
        }

        const boardJson = this.database.getBoard();
        const board = new Board(boardJson);

        this.gameSession = new GameSession(
            categories,
            numPlayers,
            players,
            players[0],
            0,
            board,
            PageState.GAME_SCREEN_ROLL_DIE
        );

        return [PageState.GAME_SCREEN_ROLL_DIE, boardJson];
    }

    rollDie() {
        const player = this.gameSession.currentPlayer;
        const roll = this.die.roll();
        const possibleLocations = this.gameSession.board.calculateNextSteps(player.row, player.column, roll);
        return [PageState.GAME_SCREEN_SELECT_SQUARE, possibleLocations];
    }

    selectSquare(row, column) {
        const player = this.gameSession.currentPlayer;
        player.setLocation(row, column);
        const square = this.gameSession.board.getSquare(row, column);

        if (square.isCenter) {
            return [PageState.CENTER_SQUARE_CATEGORY_POPUP, this.gameSession.categories];
        } else {
            const category = this.gameSession.categories[square.color];
            return this._askQuestion(category);
        }
    }

    selectCategory(color) {
        const category = this.gameSession.categories[Color[color.toUpperCase()]];
        return this._askQuestion(category);
    }

    selectAnswer(answer) {
        const question = this.gameSession.currentQuestion;
        const square = this.gameSession.currentSquare;
        const correctAnswer = question.answer;
        const answeredCorrectly = answer === correctAnswer;

        if (answeredCorrectly) {
            this.gameSession.currentPlayer.awardPoint(square.color);
        }

        this.gameSession.currentQuestion = null;
        this.gameSession.currentSquare = null;

        if (this.gameSession.currentPlayer.isWinner()) {
            return [PageState.WIN_SCREEN, this.gameSession.toJSON()];
        }

        if (!answeredCorrectly) {
            this.gameSession.goToNextPlayer();
        }

        const player = this.gameSession.currentPlayer;
        return [PageState.ROLL_DIE, player.name];
    }
}

class GUI {
    /**
     * Boundary object for GUI.
     * Not a part of the server.
     */
    constructor(server) {
        this.server = server; // Reference to server for messaging
    }

    onGameStart(categoryNames, playerNames) {
        return this.server.startGame(categoryNames, playerNames);
    }

    onDieRoll() {
        return this.server.rollDie();
    }

    onSquareSelect(row, column) {
        return this.server.selectSquare(row, column);
    }

    onCategorySelect(color) {
        return this.server.selectCategory(color);
    }

    onAnswer(answerButton) {
        return this.server.selectAnswer(answerButton);
    }
}