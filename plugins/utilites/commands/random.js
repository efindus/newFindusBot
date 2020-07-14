exports.output = async ({message, args}) => {

    args = args.join(' ').split(",");

    let id = await ef.utils.number.random(0, args.length - 1)

    ef.models.send({
        object: message,
        message: `**You have drawn option ${id + 1}:** \`${args[id].trim()}\``
    })
  }
  
  exports.data = {
    triggers: ['random'],
    description: 'Chooses one of several options.',
    usage: [
        '{prefix}{command} <option 1>, <option 2>, ...'
    ],
    args: [
        {
            'type': 'text',
            'name': 'options'
        }
    ]
  }
  
