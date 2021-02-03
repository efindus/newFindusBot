const { Attachment } = require('discord.js')
const canvas = require('canvas')

const planckeBaseURL = 'https://gen.plancke.io/exp/'
const paniekBaseURL = 'https://hypixel.paniek.de/signature/'
const mojangAPI = 'https://api.mojang.com/users/profiles/minecraft/'
var translations = {en: [], pl: [], ru: []}

exports.output = async ({message, guild, args}) => {
    try {
        let user = args[0]
        let stats = args.length > 1 ? args[1] : 'general'
        translations.pl[0] = `${ef.emotes.markNo}Podaj poprawną nazwę użytkownika!`
        translations.en[0] = `${ef.emotes.markNo}Please enter a valid username!`
        translations.ru[0] = `${ef.emotes.markNo}Пожалуйста введите действительное имя пользователя!`
        if(/[^a-z0-9_]/i.test(user) || (user.length > 16 || user.length < 3)) return ef.models.send({object: message, message: `${translations[guild.settings.language][0]}`, color: ef.colors.red})

        let desiredEndpoint = ''

        switch(stats) {
            case 'general':
                desiredEndpoint = 'general'
                break;
            case 'general-info':
                desiredEndpoint = 'general-tooltip'
                break;
            case 'bedwars':
                desiredEndpoint = 'bedwars'
                break;
            case 'duels':
                desiredEndpoint = 'duels'
                break;
            case 'skywars':
                desiredEndpoint = 'skywars?show_survived_players=true'
                break;
            case 'guild':
                desiredEndpoint = 'guild/general'
                break;
            default:
                return ef.models.send({
                    object: message,
                    message: `${ef.emotes.markNo}Select correct statistic to check!`,
                    color: ef.colors.red
                })
        }

        const response = await ef.http.get(`${planckeBaseURL}${user}.png`);

        if(Buffer.from(response.body).toString('utf8') == "ensure==BadPlayerException"){
            translations.pl[0] = `${ef.emotes.markNo}Użytkownik nie istnieje!`
            translations.en[0] = `${ef.emotes.markNo}User does not exist!`
            translations.ru[0] = `${ef.emotes.markNo}Пользователь не существует!`
            ef.models.send({
                object: message,
                message: `${translations[guild.settings.language][0]}`,
                color: ef.colors.red
            })
        } else {
            const mojangAPIResponse = await ef.http.get(`${mojangAPI}${user}`)

            const UUID = mojangAPIResponse.body.id

            const paniekAPIResponse = await ef.http.get(`${paniekBaseURL}${UUID}/${desiredEndpoint}`)

            let img = new canvas.Image()
            img.src = paniekAPIResponse.body

            let can = canvas.createCanvas(img.width, img.height)
            let ctx = can.getContext('2d')
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, img.width, img.height)
            ctx.drawImage(img, 0, 0, img.width, img.height)
            can.createPNGStream()

            const file = new Attachment(can.createPNGStream(), `${user}.png`)
            
            translations.pl[0] = `Statystyki dla ${user}`
            translations.en[0] = `Stats for ${user}`
            translations.ru[0] = `Статистика для ${user}`
            
            ef.models.send({
                object: message,
                message: ``,
                file: file,
                image: `attachment://${user}.png`,
                footer: `${translations[guild.settings.language][0]}`
            })
        }
    } catch (e) {
        ef.models.send({
            object: message,
            message: `${ef.emotes.markNo}Oops something went wrong... Try again later.`,
            color: ef.colors.red
        })
    }
}

exports.data = {
    triggers: ['hypixelstats', 'hystat'],
    description: {
        pl: 'Pokazuje wybrane statystyki użytkownika z serwera Hypixel w Minecraft.',
        en: 'Shows desired user stats from the Hypixel server in Minecraft.',
        ru: 'Показывает желаемую пользовательскую статистику с сервера Hypixel в Minecraft.'
    },
    usage: {
        pl: [
            '{prefix}{command} <nazwa użytkownika w Minecraft> <general/general-info/bedwars/duels/skywars/guild>'
        ],
        en: [
            '{prefix}{command} <Minecraft username> <general/general-info/bedwars/duels/skywars/guild>'
        ],
        ru: [
            '{prefix}{command} <Имя пользователя Minecraft> <general/general-info/bedwars/duels/skywars/guild>'
        ]
    },
    args: {
        pl: [
            {
                type: 'text',
                name: 'nazwa użytkownika w Minecraft'
            }
        ],
        en: [
            {
                type: 'text',
                name: 'Minecraft username'
            }
        ],
        ru: [
            {
                type: 'text',
                name: 'Имя пользователя Minecraft'
            }
        ]
    }
}