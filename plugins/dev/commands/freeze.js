exports.output = async ({message, guild, args}) => {
    async function emoji(emojiname) { return await ef.utils.emoji.get(emojiname, message) }

    if(args[0] == 'on') {
        ef.freezed = true
        ef.models.send({
            object: message,
            message: `${await emoji('markYes')} Pomyślnie zamrożono korzystanie z komend.`
        })
    } else if(args[0] == 'off') {
        ef.freezed = false
        ef.models.send({
            object: message,
            message: `${await emoji('markYes')} Pomyślnie odmrożono korzystanie z komend.`
        })
    } else {
        ef.models.send({
            object: message,
            message: `Zamrożenie jest obecnie **${ef.freezed == true ? 'włączone' : 'wyłączone'}**.`
        })
    }
}

exports.data = {
    triggers: ['freeze'],
    description: 'Zamraża możliwość używania komend bota.',
    usage: [
        '{prefix}{command} <on/off> - zmiana stanu',
        '{prefix}{command} - stan zamrożenia'
    ],
    developer: true
}