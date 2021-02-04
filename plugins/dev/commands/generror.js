exports.output = async ({message, guild, args}) => {
    if (message.deletable)
        message.delete(1000)

    throw `${args.join(' ')}`
}

exports.data = {
    triggers: ['generateerror'],
    description: 'Generuje błąd.',
    usage: [
        '{prefix}{command} <treść błędu>'
    ],
    developer: true
}