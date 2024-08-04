import { Color } from './color.js'
import { Direction } from './direction.js'
import { SquareType } from './squareType.js'

/**
 * Provides methods to bootstrap creation of Firestore database entries.
 * Should not be used for the app - feel free to delete.
 */

export function boardFactory() {
    return {
        0: { "color": Color.WHITE, "type": SquareType.ROLL_AGAIN, "neighbors": {[Direction.DOWN]: 10, [Direction.RIGHT]: 1} },
        1: { "color": Color.YELLOW, "neighbors": {[Direction.LEFT]: 0, [Direction.RIGHT]: 2} },
        2: { "color": Color.BLUE, "neighbors": {[Direction.LEFT]: 1, [Direction.RIGHT]: 3} },
        3: { "color": Color.GREEN, "neighbors": {[Direction.LEFT]: 2, [Direction.RIGHT]: 4} },
        4: { "color": Color.RED, "type": SquareType.HQ, "neighbors": {[Direction.LEFT]: 3, [Direction.RIGHT]: 5, [Direction.DOWN]: 14} },
        5: { "color": Color.YELLOW, "neighbors": {[Direction.LEFT]: 4, [Direction.RIGHT]: 6} },
        6: { "color": Color.BLUE, "neighbors": {[Direction.LEFT]: 5, [Direction.RIGHT]: 7} },
        7: { "color": Color.GREEN, "neighbors": {[Direction.LEFT]: 6, [Direction.RIGHT]: 8} },
        8: { "color": Color.WHITE, "type": SquareType.ROLL_AGAIN, "neighbors": {[Direction.LEFT]: 7, [Direction.DOWN]: 18} },
        10: { "color": Color.RED, "neighbors": {[Direction.UP]: 0, [Direction.DOWN]: 20} },
        14: { "color": Color.YELLOW, "neighbors": {[Direction.UP]: 4, [Direction.DOWN]: 24} },
        18: { "color": Color.RED, "neighbors": {[Direction.UP]: 8, [Direction.DOWN]: 28} },
        20: { "color": Color.GREEN, "neighbors": {[Direction.UP]: 10, [Direction.DOWN]: 30} },
        24: { "color": Color.BLUE, "neighbors": {[Direction.UP]: 14, [Direction.DOWN]: 34} },
        28: { "color": Color.YELLOW, "neighbors": {[Direction.UP]: 18, [Direction.DOWN]: 38} },
        30: { "color": Color.BLUE, "neighbors": {[Direction.UP]: 20, [Direction.DOWN]: 40} },
        34: { "color": Color.GREEN, "neighbors": {[Direction.UP]: 24, [Direction.DOWN]: 44} },
        38: { "color": Color.BLUE, "neighbors": {[Direction.UP]: 28, [Direction.DOWN]: 48} },
        40: { "color": Color.YELLOW, "type": SquareType.HQ, "neighbors": {[Direction.UP]: 30, [Direction.DOWN]: 50, [Direction.RIGHT]: 41} },
        41: { "color": Color.BLUE, "neighbors": {[Direction.LEFT]: 40, [Direction.RIGHT]: 42} },
        42: { "color": Color.GREEN, "neighbors": {[Direction.LEFT]: 41, [Direction.RIGHT]: 43} },
        43: { "color": Color.RED, "neighbors": {[Direction.LEFT]: 42, [Direction.RIGHT]: 44} },
        44: { "color": Color.WHITE, "type": SquareType.CENTER, "neighbors": {[Direction.LEFT]: 43, [Direction.RIGHT]: 45, [Direction.UP]: 34, [Direction.DOWN]: 54} },
        45: { "color": Color.BLUE, "neighbors": {[Direction.LEFT]: 44, [Direction.RIGHT]: 46} },
        46: { "color": Color.YELLOW, "neighbors": {[Direction.LEFT]: 45, [Direction.RIGHT]: 47} },
        47: { "color": Color.RED, "neighbors": {[Direction.LEFT]: 46, [Direction.RIGHT]: 48} },
        48: { "color": Color.GREEN, "type": SquareType.HQ, "neighbors": {[Direction.LEFT]: 47, [Direction.UP]: 38, [Direction.DOWN]: 58} },
        50: { "color": Color.RED, "neighbors": {[Direction.UP]: 40, [Direction.DOWN]: 60} },
        54: { "color": Color.YELLOW, "neighbors": {[Direction.UP]: 44, [Direction.DOWN]: 64} },
        58: { "color": Color.RED, "neighbors": {[Direction.UP]: 48, [Direction.DOWN]: 68} },
        60: { "color": Color.GREEN, "neighbors": {[Direction.UP]: 50, [Direction.DOWN]: 70} },
        64: { "color": Color.RED, "neighbors": {[Direction.UP]: 54, [Direction.DOWN]: 74} },
        68: { "color": Color.YELLOW, "neighbors": {[Direction.UP]: 58, [Direction.DOWN]: 78} },
        70: { "color": Color.BLUE, "neighbors": {[Direction.UP]: 60, [Direction.DOWN]: 80} },
        74: { "color": Color.GREEN, "neighbors": {[Direction.UP]: 64, [Direction.DOWN]: 84} },
        78: { "color": Color.BLUE, "neighbors": {[Direction.UP]: 68, [Direction.DOWN]: 88} },
        80: { "color": Color.WHITE, "type": SquareType.ROLL_AGAIN, "neighbors": {[Direction.UP]: 70, [Direction.RIGHT]: 81} },
        81: { "color": Color.YELLOW, "neighbors": {[Direction.LEFT]: 80, [Direction.RIGHT]: 82} },
        82: { "color": Color.RED, "neighbors": {[Direction.LEFT]: 81, [Direction.RIGHT]: 83} },
        83: { "color": Color.GREEN, "neighbors": {[Direction.LEFT]: 82, [Direction.RIGHT]: 84} },
        84: { "color": Color.BLUE, "type": SquareType.HQ, "neighbors": {[Direction.LEFT]: 83, [Direction.RIGHT]: 85} },
        85: { "color": Color.YELLOW, "neighbors": {[Direction.LEFT]: 84, [Direction.RIGHT]: 86} },
        86: { "color": Color.RED, "neighbors": {[Direction.LEFT]: 85, [Direction.RIGHT]: 87} },
        87: { "color": Color.GREEN, "neighbors": {[Direction.LEFT]: 86, [Direction.RIGHT]: 88} },
        88: { "color": Color.WHITE, "type": SquareType.ROLL_AGAIN, "neighbors": {[Direction.LEFT]: 87, [Direction.UP]: 78} },
    };
};



// export const _MOCK_DATABASE = {
//     // "Categories": {
//     //     "Geography": [
//     //         {
//     //             "QuestionUniqueID": "unique_id_1",
//     //             "DateCreated": "YYYY-MM-DD",
//     //             "DifficultyLevel": "easy",
//     //             "UsageStatistics": {
//     //                 "TimesAsked": 10,
//     //                 "CorrectAnswerPercentage": 70
//     //             },
//     //             "Creator": "creator_name",
//     //             "Answer": "answer_text",
//     //             "TypeOfQuestion": "text",
//     //             "TextDetails": {
//     //                 "Question": "What is the capital of France?",
//     //                 "TextType": "multiple_choice"
//     //             }
//     //         }
//     //     ],
//     //     "Art_Literature": [
//     //         {
//     //             "QuestionUniqueID": "unique_id_2",
//     //             "DateCreated": "YYYY-MM-DD",
//     //             "DifficultyLevel": "medium",
//     //             "UsageStatistics": {
//     //                 "TimesAsked": 5,
//     //                 "CorrectAnswerPercentage": 60
//     //             },
//     //             "Creator": "creator_name",
//     //             "Answer": "answer_text",
//     //             "TypeOfQuestion": "audio",
//     //             "FileLocation": "firebase_storage_location"
//     //         }
//     //     ],
//     //     "Science_Nature": [
//     //         {
//     //             "QuestionUniqueID": "unique_id_3",
//     //             "DateCreated": "YYYY-MM-DD",
//     //             "DifficultyLevel": "hard",
//     //             "UsageStatistics": {
//     //                 "TimesAsked": 8,
//     //                 "CorrectAnswerPercentage": 50
//     //             },
//     //             "Creator": "creator_name",
//     //             "Answer": "answer_text",
//     //             "TypeOfQuestion": "image",
//     //             "FileLocation": "firebase_storage_location"
//     //         }
//     //     ],
//     //     "History": [
//     //         {
//     //             "QuestionUniqueID": "unique_id_4",
//     //             "DateCreated": "YYYY-MM-DD",
//     //             "DifficultyLevel": "easy",
//     //             "UsageStatistics": {
//     //                 "TimesAsked": 12,
//     //                 "CorrectAnswerPercentage": 80
//     //             },
//     //             "Creator": "creator_name",
//     //             "Answer": "answer_text",
//     //             "TypeOfQuestion": "video",
//     //             "FileLocation": "firebase_storage_location"
//     //         }
//     //     ],
//     //     "Sport_Leisure": [
//     //         {
//     //             "QuestionUniqueID": "unique_id_5",
//     //             "DateCreated": "YYYY-MM-DD",
//     //             "DifficultyLevel": "medium",
//     //             "UsageStatistics": {
//     //                 "TimesAsked": 15,
//     //                 "CorrectAnswerPercentage": 65
//     //             },
//     //             "Creator": "creator_name",
//     //             "Answer": "answer_text",
//     //             "TypeOfQuestion": "text",
//     //             "TextDetails": {
//     //                 "Question": "Who won the World Cup in 2018?",
//     //                 "TextType": "open_ended"
//     //             }
//     //         }
//     //     ]
//     // },
//     // "Users": {
//     //     "user_uuid_1": {
//     //         "Name": "John Doe",
//     //         "Email": "john.doe@example.com",
//     //         "Grade": "A",
//     //         "GameHistory": {
//     //             "GamesPlayed": 10,
//     //             "WinLossRecord": {
//     //                 "Wins": 6,
//     //                 "Losses": 4
//     //             }
//     //         },
//     //         "AchievementTracking": {
//     //             "Achievements": [
//     //                 "First Win",
//     //                 "High Score"
//     //             ]
//     //         }
//     //     }
//     // },
//     // "GameSessions": [
//     //     {
//     //         "Timestamp": "YYYY-MM-DDTHH:MM:SSZ",
//     //         "GameSessionID": "game_session_id_1",
//     //         "ParticipatingPlayers": [
//     //             "user_id_1",
//     //             "user_id_2"
//     //         ],
//     //         "CurrentGameState": {
//     //             "BoardConfiguration": "board_config",
//     //             "PlayerPositions": {
//     //                 "user_id_1": "position_1",
//     //                 "user_id_2": "position_2"
//     //             },
//     //             "Scores": {
//     //                 "user_id_1": 50,
//     //                 "user_id_2": 40
//     //             }
//     //         },
//     //         "GameSettings": {
//     //             "NumberOfQuestions": 20,
//     //             "CategoriesInPlay": [
//     //                 "Geography",
//     //                 "Science_Nature"
//     //             ],
//     //             "CustomRules": "no_rules"
//     //         },
//     //         "ChatLogs": [
//     //             {
//     //                 "UserID": "user_id_1",
//     //                 "Message": "Good luck!"
//     //             }
//     //         ],
//     //         "QuestionIDList": [
//     //             "unique_id_1",
//     //             "unique_id_3"
//     //         ]
//     //     }
//     // ],
//     // "Board": ////
// };