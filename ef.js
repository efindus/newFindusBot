const { Client } = require("discord.js")
require('dotenv').config();

class ef extends Client {
    constructor(bot){
        super(bot)

        global.ef = this

        this.files = [
            'releasenotes',
            'colors',
            'prefixes',
            'roles',
            'emotes',
            'channelsdb'
        ]

        this.files.forEach(file => {
            this[file] = require(`./files/${file}.json`)
        })

        this.tokens = []

        this.freezed = false
        
        this.userbans = []

        this.color = this.colors.green

        this.tokens.secrets = [
            'fortniteapi',
            'MONGO_ID',
            'maindiscordapi',
            'betadiscordapi',
            'SpotifyID',
            'SpotifySecret',
            'HerokuCLIUserID',
            'HerokuCLIToken',
            'currentApp',
            'youtubeAPI',
            'istest'
        ]

        this.tokens.secrets.forEach(secret =>
            this.tokens[secret] = process.env[secret]
        )

        if(this.tokens['istest'] !== 'true') this.tokens['istest'] = 'false'

        this.types = ['main', 'beta']

        if(!this.types.includes(process.argv[2])){
            console.log(`Frozen own process (version argument needed (${this.types.join(", ")}))`)
            if(this.tokens.istest == 'true') {
                process.exit(2)
            }
            while(true){}
        }

        this.type = process.argv[2]

        this.dbcli = new (require('mongodb').MongoClient)(this.tokens['MONGO_ID'], { useNewUrlParser: true , useUnifiedTopology: true })
        this.dbcli.connect(async err => {
            if(err) {
                console.log(err)
                console.log("Frozen own process (error on connection with DB)") 
                if(this.tokens.istest == 'true') {
                    process.exit(1)
                }
                while(true){}
            }

            this.db = require("./database")

            this.db.collections = [
                'fortnite',
                'botinfo',
                'servers',
                'applydata',
                'scheduledmsgs'
            ]

            this.db.collections.forEach(collection => {
                this.db[collection] = this.dbcli.db("findusbotdata").collection(collection)
            })

            this.db.cache = {}

            for(var i = 0; i < this.db.collections.length; i++){
                this.db.cache[this.db.collections[i]] = await this.db.findDocMongo(`${this.db.collections[i]}`)
            }

            this.http = require('snekfetch')

            /*await new Promise(async (resolve, reject) => {
                const result = await this.http.get(`https://${this.tokens.LavalinkHost_1}/loadtracks}`)
                .catch(async err => {
                    if(err.status !== 503) {
                        this.tokens.LavalinkHost = this.tokens.LavalinkHost_1
                    } else {
                        const result = await this.http.get(`https://${this.tokens.LavalinkHost_2}/loadtracks}`)
                        .catch(async err => {
                            if(err.status !== 503) {
                                this.tokens.LavalinkHost = this.tokens.LavalinkHost_2
                            } else {
                                console.log("Frozen own process (error on connection with Lavalink)") 
                                while(true){}
                            }
                            return null
                        })
                    }
                    return null
                })
        
                resolve()
            })*/

            this.eventHandler = new (require('./handlers/events.js'))(this)

            this.models = require("./models")

            this.prefix = this.prefixes[this.type]

            this.utils = require('./utils')

            this.load = require('lodash')

            await this.login(this.tokens[this.type + 'discordapi'])
        })
    }
}

new ef({})

process.on('unhandledRejection', e => {
    console.log(e)
})

process.on('uncaughtException', e => {
    console.log(e)
})
