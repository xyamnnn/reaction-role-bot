const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ] 
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = '1475720060013379705'; // Replace with your channel ID

// Map emojis to role IDs (from your list)
const reactionRoles = {
    // Weather Roles
    '🌫️': '1475714751433543703', // Fog
    '🌧️': '1475714754466025575', // Rain
    '🌪️': '1475714757376999578', // Sandstorm
    '❄️': '1475714760925515977', // Snow
    '✨': '1475714764448731157', // Starfall
    '⛈️': '1475714768223342743', // Storm
    '☄️': '1475714771549687891', // Meteor Shower
    '🌊': '1475714774393163890', // Tsunami
    '🌱': '1475714777668915274', // Seed Rain
    
    // Seed Roles
    '🥕': '1475714781179674675', // Carrot Seed
    '🌽': '1475714783998378006', // Corn Seed
    '🧅': '1475714787873652911', // Onion Seed
    '🍓': '1475714791636205769', // Strawberry Seed
    '🍄': '1475714794869887100', // Mushroom Seed
    '🍠': '1475714797986254900', // Beetroot Seed
    '🍅': '1475714800980857012', // Tomato Seed
    '🍎': '1475714803954614282', // Apple Seed
    '🌹': '1475714807205335211', // Rose Seed
    '🌾': '1475714810480951386', // Wheat Seed
    '🍌': '1475714813559570432', // Banana Seed
    '🍑': '1475714816705433714', // Plum Seed
    '🥔': '1475714819741974548', // Potato Seed
    '🥬': '1475714829242335272', // Cabbage Seed
    '🍒': '1475714832731738163', // Cherry Seed
    
    // Gear Roles
    '💧': '1475714836603338825', // Watering Can
    '💦': '1475714839824564470', // Basic Sprinkler
    '🔔': '1475714843561431082', // Harvest Bell
    '⚡': '1475714846283665480', // Turbo Sprinkler
    '⭐': '1475714849693634621', // Favorite Tool
    '🌀': '1475714852944216196'  // Super Sprinkler
};

client.once('ready', async () => {
    console.log(`✅ Bot is online 24/7 as ${client.user.tag}`);
    
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        
        // Create embed with 3 sections
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🎮 GAME ROLE SELECTION')
            .setDescription('React with the emojis below to get the corresponding roles!')
            .addFields(
                {
                    name: '🌤️ WEATHER ROLES',
                    value: '🌫️ - Fog\n🌧️ - Rain\n🌪️ - Sandstorm\n❄️ - Snow\n✨ - Starfall\n⛈️ - Storm\n☄️ - Meteor Shower\n🌊 - Tsunami\n🌱 - Seed Rain',
                    inline: true
                },
                {
                    name: '🌱 SEED ROLES',
                    value: '🥕 - Carrot Seed\n🌽 - Corn Seed\n🧅 - Onion Seed\n🍓 - Strawberry Seed\n🍄 - Mushroom Seed\n🍠 - Beetroot Seed\n🍅 - Tomato Seed\n🍎 - Apple Seed\n🌹 - Rose Seed',
                    inline: true
                },
                {
                    name: '⚙️ GEAR ROLES',
                    value: '🌾 - Wheat Seed\n🍌 - Banana Seed\n🍑 - Plum Seed\n🥔 - Potato Seed\n🥬 - Cabbage Seed\n🍒 - Cherry Seed\n💧 - Watering Can\n💦 - Basic Sprinkler\n🔔 - Harvest Bell',
                    inline: true
                },
                {
                    name: '⚙️ GEAR ROLES (Continued)',
                    value: '⚡ - Turbo Sprinkler\n⭐ - Favorite Tool\n🌀 - Super Sprinkler',
                    inline: true
                }
            )
            .setFooter({ text: 'React to get roles | Remove reaction to remove role' })
            .setTimestamp();

        const message = await channel.send({ embeds: [embed] });
        
        // Add all reactions
        for (const emoji in reactionRoles) {
            await message.react(emoji);
        }
        
        console.log('✅ Role message sent with all reactions!');
    } catch (error) {
        console.log('Could not send message:', error.message);
    }
});

// Handle reaction adds
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    
    try {
        if (reaction.partial) await reaction.fetch();
        
        const roleId = reactionRoles[reaction.emoji.name];
        if (!roleId) return;
        
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        const role = await guild.roles.fetch(roleId);
        
        if (role && !member.roles.cache.has(roleId)) {
            await member.roles.add(role);
            console.log(`✅ Added ${role.name} to ${user.tag}`);
        }
    } catch (error) {
        console.log('Error adding role:', error.message);
    }
});

// Handle reaction removes
client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    
    try {
        if (reaction.partial) await reaction.fetch();
        
        const roleId = reactionRoles[reaction.emoji.name];
        if (!roleId) return;
        
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        const role = await guild.roles.fetch(roleId);
        
        if (role && member.roles.cache.has(roleId)) {
            await member.roles.remove(role);
            console.log(`❌ Removed ${role.name} from ${user.tag}`);
        }
    } catch (error) {
        console.log('Error removing role:', error.message);
    }
});

client.login(TOKEN);
