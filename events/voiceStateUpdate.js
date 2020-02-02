module.exports = async (oldMem, newMem) => {
    try{
        var vC = oldMem.voiceChannelID
        var guild = oldMem.guild.id
        var player = ef.queue[guild]
        if (!player || vC != player.connection.channel.id) return
        if (!ef.channels.get(player.connection.channel.id)) return
        var nconnected = true
        var array = ef.channels.get(player.connection.channel.id).members.array()
        for(var key in array) {
            if(array[key].user.id == ef.user.id) {
                nconnected = false
            }
        }
        if(nconnected == true) {
            ef.queue[guild].queue = []
            ef.queue[guild].player.end()
            await ef.guilds.get(guild).voiceConnection.disconnect()
            delete ef.queue[guild]
            return
        }
        if (ef.channels.get(player.connection.channel.id).members.size == 1) {
            if(player.autoleave == false) return
            setTimeout(async () => {
                if (ef.channels.get(player.connection.channel.id).members.size == 1) {
                    ef.queue[guild].queue = []
                    await ef.queue[guild].player.end()
                    await ef.guilds.get(guild).voiceConnection.disconnect()
                    delete ef.queue[guild]
                }
            }, 10 * 1000)
        }
    } catch(err) {
        console.log(err)
    }
}

  