exports.output = async ({message, guild, args}) => {
    var data = await ef.db.findDoc('applydata')
    var thisdata
    var applymodel = {
        guildid: message.guild.id,
        id: '',
        logid: '',
        status: 'off',
        roleTake: '',
        roleGive: ''
    }
    var exist = false
    for(var i = 0; i < data.length; i++) {
        if(data[i].id == message.channel.id) {
            exist = true
            thisdata = data[i]
            break
        }
    }
    if(args[0] != '-set' && !exist) {
        ef.models.send({
            object: message,
            message: `${ef.emotes.markNo}Funkcja nie została skonfigurawana!`,
            color: ef.colors.red
        })
    } else if(args[0] == '-set' && !(message.member.hasPermission('MANAGE_GUILD') || ef.roles.developers.includes(message.author.id))) {
        ef.models.send({
            object: message,
            message: `${ef.emotes.markNo}Nie masz uprawnień aby skonfigurawać tę funkcję!`,
            color: ef.colors.red
        })
    } else if(args[0] == '-set') {
        var id = args[1].replace(/[<#>]/g, '')
        var channel

        if(message.guild.channels.get(id)){
            channel = message.guild.channels.get(id).id
        } else if(message.guild.channels.get(args[1])) {
            channel = message.guild.channels.get(args[1]).id
        }
        if(!channel) {
            return ef.models.send({
                object: message,
                message: `${ef.emotes.markNo}Podaj poprawny kanał!`,
                color: ef.colors.red
            })
        }
        exist = false
        for(var i = 0; i < data.length; i++) {
            if(data[i].id == channel) {
                exist = true
                thisdata = data[i]
                break
            }
        }
        if(exist == false) {
            applymodel.id = channel
            thisdata = applymodel
            await ef.db.addDoc(applymodel, 'applydata')
        }
        if(args[2] == 'on') {
            if(thisdata.logid == '') {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markNo}Musisz podać kanał logowania!`,
                    color: ef.colors.red
                })
            } else {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markYes}Pomyślnie włączono funkcję!`
                })
                return ef.db.editDoc({id: thisdata.id}, {status: 'on'}, 'applydata')
            }
        } 
        if(args[2] == 'off') {
            ef.models.send({
                object: message,
                message: `${ef.emotes.markYes}Pomyślnie wyłączono funkcję!`
            })
            return ef.db.editDoc({id: thisdata.id}, {status: 'off'}, 'applydata')
        }
        if(args[2] == 'addrole') {
            var id = args[3].replace(/[<@&>]/g, '')
            var role

            if(message.guild.roles.get(id)){
                role = message.guild.roles.get(id).id
            } else if(message.guild.roles.get(args[3])) {
                role = message.guild.roles.get(args[3]).id
            }

            if(!role) {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markYes}Pomyślnie wyłączono dodawanie ról!`
                })
                return ef.db.editDoc({id: thisdata.id}, {roleGive: ''}, 'applydata')
            } else {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markYes}Pomyślnie włączono dodawanie ról!`
                })
                return ef.db.editDoc({id: thisdata.id}, {roleGive: role}, 'applydata')
            }
        }

        if(args[2] == 'remrole') {
            var id = args[3].replace(/[<@&>]/g, '')
            var role

            if(message.guild.roles.get(id)){
                role = message.guild.roles.get(id).id
            } else if(message.guild.roles.get(args[3])) {
                role = message.guild.roles.get(args[3]).id
            }

            if(!role) {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markYes}Pomyślnie wyłączono zabieranie ról!`
                })
                return ef.db.editDoc({id: thisdata.id}, {roleTake: ''}, 'applydata')
            } else {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markYes}Pomyślnie włączono zabieranie ról!`
                })
                return ef.db.editDoc({id: thisdata.id}, {roleTake: role}, 'applydata')
            }
        }

        if(args[2] == 'log') {
            var id = args[3].replace(/[<#>]/g, '')
            var channel

            if(message.guild.channels.get(id)){
                channel = message.guild.channels.get(id).id
            } else if(message.guild.channels.get(args[3])) {
                channel = message.guild.channels.get(args[3]).id
            }
            if(!channel) {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markNo}Podaj poprawny kanał!`,
                    color: ef.colors.red
                })
            } else {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markYes}Pomyślnie ustawiono kanał logowania zapisów!`
                })
                return ef.db.editDoc({id: thisdata.id}, {logid: channel}, 'applydata')
            }
        }

        if(args[2] == 'delete') {
            ef.models.send({
                object: message,
                message: `${ef.emotes.markYes}Pomyślnie usunięto funkcję z wybranego kanału!`
            })
            return ef.db.remDoc({id: thisdata.id}, 'applydata')
        }
    } else {
        if(thisdata.status != 'on') {
            var Message = await ef.models.send({
                object: message,
                message: `${ef.emotes.markNo}Ta funkcja jest wyłączona!`,
                color: ef.colors.red
            })
            message.delete()
            Message.delete(20000)
            return
        } else {
            if(!args[0]) {
                var Message = await ef.models.send({
                    object: message,
                    message: `${ef.emotes.markNo}Musisz wpisać tekst zgłoszenia!`,
                    color: ef.colors.red
                })
                message.delete()
                Message.delete(20000)
                return
            }
            var Message = await ef.models.send({
                object: message,
                message: `${ef.emotes.markYes}Pomyślnie się zapisałeś **${message.author.tag}**!`
            })
            Message.delete(20000)
        }
        var applymessage = args.join(' ')
        var logchannel = message.guild.channels.get(thisdata.logid)
        if(logchannel !== undefined) {
            logchannel.send(`**${message.author.tag} zapisał się:** \`${applymessage}\``)
        } else {
            ef.models.send({
                object: message,
                message: `${ef.emotes.markNo}Kanał logowania zapisów jest niepoprawny.`,
                color: ef.colors.red
            })
        }
        if(thisdata.roleTake != '') {
            var trole = message.guild.roles.get(thisdata.roleTake)
            if(trole !== undefined) {
                message.member.removeRole(thisdata.roleTake)
            } else {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markNo}Rola do zabrania jest niepoprawna.`,
                    color: ef.colors.red
                })
            }
        }
        if(thisdata.roleGive != '') {
            var grole = message.guild.roles.get(thisdata.roleGive)
            if(grole !== undefined) {
                message.member.addRole(thisdata.roleGive)
            } else {
                ef.models.send({
                    object: message,
                    message: `${ef.emotes.markNo}Rola do dodania jest niepoprawna.`,
                    color: ef.colors.red
                })
            }
        }
        message.delete()
    }
}

exports.data = {
    triggers: ['apply'],
    description: '[KOMENDA EKSPERYMENTALNA]',
    usage: [
        '{prefix}{command} <argumenty> - zgłoszenie',
        '{prefix}{command} -set <#channel> addrole <role mention/nothing (to disable)>',
        '{prefix}{command} -set <#channel> remrole <role mention/nothing (to disable)>',
        '{prefix}{command} -set <#channel> log <#channel>',
        '{prefix}{command} -set <#channel> <on/off>',
        '{prefix}{command} -set <#channel> delete'
    ]
}
