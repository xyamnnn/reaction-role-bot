const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ] 
});

// Your bot token from environment variable
const TOKEN = process.env.TOKEN;
const reactionRoles = {
    // Weather
    '🌫️': 'Fog',
    '🌧️': 'Rain',
    '🌪️': 'Sandstorm',
    '❄️': 'Snow',
    '✨': 'Starfall',
    '⛈️': 'Storm',
    '☄️': 'Meteor Shower',
    '🌊': 'Tsunami',
    '🌱': 'Seed Rain',
    
    // Seeds
    '🥕': 'Carrot Seed',
    '🌽': 'Corn Seed',
    '🧅': 'Onion Seed',
    '🍓': 'Strawberry Seed',
    '🍄': 'Mushroom Seed',
    '🍠': 'Beetroot Seed',
    '🍅': 'Tomato Seed',
    '🍎': 'Apple Seed',
    '🌹': 'Rose Seed',
    '🌾': 'Wheat Seed',
    '🍌': 'Banana Seed',
    '🍑': 'Plum Seed',
    '🥔': 'Potato Seed',
    '🥬': 'Cabbage Seed',
    '🍒': 'Cherry Seed',
    
    // Gears
    '💧': 'Watering Can',
    '💦': 'Basic Sprinkler',
    '🔔': 'Harvest Bell',
    '⚡': 'Turbo Sprinkler',
    '⭐': 'Favorite Tool',
    '🌀': 'Super Sprinkler'
};

client.once('ready', async () => {
    console.log(`✅ Bot is online 24/7 as ${client.user.tag}`);
    
    // Optional: Send the role message to a specific channel
    // Replace with your channel ID
    const channelId = 'YOUR_CHANNEL_ID_HERE';
    try {
        const channel = await client.channels.fetch(channelId);
        
        const message = `**🎮 GAME ROLE SELECTION**

React with the emojis below to get the corresponding roles!

**🌤️ WEATHER ROLES**
🌫️ - Fog
🌧️ - Rain
🌪️ - Sandstorm
❄️ - Snow
✨ - Starfall
⛈️ - Storm
☄️ - Meteor Shower
🌊 - Tsunami
🌱 - Seed Rain

**🌱 SEED ROLES**
🥕 - Carrot Seed
🌽 - Corn Seed
🧅 - Onion Seed
🍓 - Strawberry Seed
🍄 - Mushroom Seed
🍠 - Beetroot Seed
🍅 - Tomato Seed
🍎 - Apple Seed
🌹 - Rose Seed
🌾 - Wheat Seed
🍌 - Banana Seed
🍑 - Plum Seed
🥔 - Potato Seed
🥬 - Cabbage Seed
🍒 - Cherry Seed

**⚙️ GEAR ROLES**
💧 - Watering Can
💦 - Basic Sprinkler
🔔 - Harvest Bell
⚡ - Turbo Sprinkler
⭐ - Favorite Tool
🌀 - Super Sprinkler

*React to get roles | Remove reaction to remove role*`;

        const sentMessage = await channel.send(message);
        
        // Add all reactions
        for (const emoji in reactionRoles) {
            await sentMessage.react(emoji);
        }
        console.log('✅ Role message sent with all reactions!');
    } catch (error) {
        console.log('Could not send message (maybe channel ID not set):', error.message);
    }
});

// Handle reaction adds
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    
    // Fetch if partial
    if (reaction.partial) await reaction.fetch();
    
    const emoji = reaction.emoji.name;
    const roleName = reactionRoles[emoji];
    
    if (!roleName) return;
    
    try {
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        const role = guild.roles.cache.find(r => r.name === roleName);
        
        if (role && !member.roles.cache.has(role.id)) {
            await member.roles.add(role);
            console.log(`✅ Added ${roleName} to ${user.tag}`);
        }
    } catch (error) {
        console.log('Error adding role:', error.message);
    }
});

// Handle reaction removes
client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    
    if (reaction.partial) await reaction.fetch();
    
    const emoji = reaction.emoji.name;
    const roleName = reactionRoles[emoji];
    
    if (!roleName) return;
    
    try {
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        const role = guild.roles.cache.find(r => r.name === roleName);
        
        if (role && member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            console.log(`❌ Removed ${roleName} from ${user.tag}`);
        }
    } catch (error) {
        console.log('Error removing role:', error.message);
    }
});


client.login(TOKEN);





