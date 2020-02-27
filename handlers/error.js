module.exports = async (message, guild, error, suggest = false) => {
    var translations = {en: [], pl: [], ru: []}
    const code = Math.floor(Math.random() * 9999 + 1)
    if(!suggest){
        translations.pl[0] = 
`O nie! Jakiś błąd wkradł się do mojego kodu!
Muszę powiadomić developera, on na pewno pomoże.
Tymczasem informuję, że spowodowałeś błąd o kodzie **#${code}**.
Przepraszam za utrudnienia!`
        translations.en[0] = 
`**Ooops! Something went wrong!**

This shouldn't have happened!
The error has been reported to the developer with code **#${code}**.`
        translations.ru[0] = 
`**Упс! Что-то пошло не так!**

Этого не должно было случиться!
Об ошибке было сообщено разработчику с кодом **#${code}**.`
        ef.models.send({
            object: message,
            message: `${translations[guild.settings.language][0]}`,
            color: ef.colors.red
        })
    }

    if(ef.type == 'beta') {
        return console.log(error)
    }
    
    ef.roles.developers.forEach(dev => {
        ef.users.get(dev).send(
`***Error Raport:***

**[Server ID]:** \`${message.guild.id}\`,
**[User ID]:** \`${message.author.id}\`,
**[Command]:** \`${message.content}\`,

${error.stack ? `**[Error Stack]:**
\`${error.stack}\`` : `**[Error]:**
\`${error}\``}`)
    });
}