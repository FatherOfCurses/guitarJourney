"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const session = {
    id: 'id12345',
    date: '10/01/2021',
    practiceTime: 45,
    whatToPractice: 'Stairway to Heaven',
    sessionIntent: 'Get acoustic fingerpicking down',
    postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
    goalForNextTime: 'Fingerpicking at 100%'
};
const sessions = [
    {
        id: 'id12345',
        date: '10/01/2021',
        practiceTime: 45,
        whatToPractice: 'Stairway to Heaven',
        sessionIntent: 'Get acoustic fingerpicking down',
        postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
        goalForNextTime: 'Fingerpicking at 100%'
    },
    {
        id: 'id98764',
        date: '10/31/2021',
        practiceTime: 20,
        whatToPractice: 'Paradise City',
        sessionIntent: 'Try playing solo all the way through',
        postPracticeReflection: 'Really rough, dont think I made it all the way through',
        goalForNextTime: 'Spend more time warming up before practice'
    }
];
const SessionServiceMock = {
    // BASE_URL: 'https://some.url',
    getSession$: jest.fn(() => (0, rxjs_1.of)(session)),
    getAllSessions$: jest.fn(() => (0, rxjs_1.of)(sessions)),
    putSession$: jest.fn(() => (0, rxjs_1.of)('success'))
};
exports.default = SessionServiceMock;
