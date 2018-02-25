const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const header = Buffer.from([0xFF,0xFF,0xFF,0xFF,0x54]);
const payload = Buffer.from("Source Engine Query");
const suffix = Buffer.from([0x00]);
const message = Buffer.concat([header, payload, suffix], header.length + payload.length + suffix.length);

client.on("message", function (msg, info) {
    // Skip prefix(4), header(1), protocol(1) (4 + 1 + 1)
    msg = msg.slice(6);
    let index;
    // Get name
    let name = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Get Map Name
    let map = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Skip folder name
    msg = msg.slice(msg.indexOf(0x00)+1);
    // Skip game name
    msg = msg.slice(msg.indexOf(0x00)+1);
    // Read game id
    let gameId = msg.readInt16LE();
    msg = msg.slice(2);
    // Number of players
    let playerCount = msg.readInt8();
    msg = msg.slice(1);
    // Max players
    let maxPlayers = msg.readInt8();

    console.log('name: ' + name);
    console.log('map: ' + map);
    console.log('gameId: ' + gameId);
    console.log('playerCount: ' + playerCount);
    console.log('maxPlayers: ' + maxPlayers);
    console.log('msg: ' + msg.toString());
    console.log(msg);
    client.close();
});

client.send(message, 27015, 'gokz.rutoc.me', (err) => {
    if (err) {
        console.log(err);
        client.close();
    } else {
        console.log("sent");
    }
});