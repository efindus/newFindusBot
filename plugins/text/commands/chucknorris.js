exports.output = async ({message}) => {
    ef.models.apibadosz({
        object: message,
        endpoint: 'chucknorris',
        type: 'text',
        output: 'joke'
    })
}
exports.data = {
    triggers: ['chucknorris'],
    description: `Pokazuje żart o Chucku Norrisie. (W języku angielskim)`
}
  
