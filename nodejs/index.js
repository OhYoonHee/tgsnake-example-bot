require('dotenv/config');
const config = process.env;
const {Snake, Filters} = require('tgsnake');
const {CustomFile} = require('telegram/client/uploads');
const fs = require('fs');

const Client = new Snake({
    'api_id' : Number(config.API_ID),
    'api_hash' : config.API_HASH,
    'session' : config.SESSION
});
Client.run();

//Handle update
Client.onNewMessage(async(ctx, message)=>{
    /*
        Sending a message
    */
    await ctx.reply('your message');
    await ctx.replyHTML('<i>your message</i>');

    /*
        Snake.client.sendFile example
    */
    await Client.client.sendFile(message.chat.id, {
        file : 'https://raw.githubusercontent.com/butthx/tgsnake/master/tgsnake.jpg',
        caption : "Send File by URL"
    });

    await Client.client.sendFile(message.chat.id, {
        file : 'path/to/file',
        caption : 'Send File by path'
    });

    await Client.client.sendFile(message.chat.id, {
        file : 'buffer',
        caption : "Send file by buffer"
    });

    /*
        sending file using TelegramClient.uploadFile
    */
    var custom_file = new CustomFile('whatfile.ext', fs.statSync('path/to/file.ext').size, 'path/to/file.ext');
    var file = await Client.client.uploadFile({
        file : custom_file,
        workers : 5
    });
    await Client.client.sendFile(message.chat.id, {
        file,
        caption : "Send file by TelegramClient.uploadFile"
    })

    /*
        Using class Filters 
    */
    let filter = new Filters(Client);

    //Filters command
    filter.cmd('start', async (match)=>{
        await ctx.reply("This is command start!!")
        return;
    });
    //Filters regex
    filter.hears(/h+e+l+o/i, async (match)=>{
        await ctx.reply("Hey");
        return;
    })

    //Using Snake.telegram
    await Client.telegram.sendMessage(message.chat.id, 'any message');
    var get_messages = await Client.telegram.getMessages(message.chat.id, [message.id]);
    console.log(get_messages);
    //pin message
    await Client.telegram.pinMessage(message.chat.id, message.id);

    //Download media
    if(message.media){
        var buffer = await Client.client.downloadMedia(message.media)
        fs.writeFileSync('path/to/file', buffer)
    }
    
    //Using Snake.client
    /*
    Cliet.client.<gramjs method>
    */
});