exports.output = async ({message}) => {
    ef.models.apiaf4({
        object: message,
        endpoint: 'nimplex',
        type: 'text',
        output: 'text'
    })
}
exports.data = {
    triggers: ['nimplex', 'nimpleks', 'nimblegz', 'debil'],
    description: {
        pl: 'Pokazuje losowy tekst o nimblegzie.',
        en: 'Shows random text about nimblegz.',
        ru: 'Показывает случайный текст о нимблегзе.'
    }
}
