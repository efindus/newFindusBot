const imageType = require('image-type')
const { Attachment } = require('discord.js')
module.exports = async (data) => {

	data = await Object.assign({
		object: null,
		endpoint: null,
		type: 'image',
		output: null,
		title: '',
		color: ef.color,
		footer: ''
	}, data)

	ef.http.get(`http://api.alt-f4-team.xyz/${data.endpoint}`)
		.then(async response => {
			if (data.type == 'text') {
				let text = response.body[data.output]
					text = `\`` + text + `\``
				let author = response.body.author;
				ef.models.send({
					object: data.object,
					message: `${text}`,
					footer: `powered by api.alt-f4-team.xyz • Invoked by ${data.object.author.username}${author ? ` • Author: ${author}` : null}`
				})
			} else if (data.type == "image") {
				const type = imageType(response.body)
				const file = new Attachment(response.body, `file.${type ? type.ext : 'png'}`)
				ef.models.send({
					object: data.object,
					message: data.title,
					file: file,
					image: `attachment://file.${type ? type.ext : 'png'}`,
					footer: `powered by api.alt-f4-team.xyz • Invoked by ${data.object.author.username}`,
				})
			}
		}).catch(error => {
			return require('../handlers/error')(data.object, error)
		})
}
