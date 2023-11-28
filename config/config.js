var Ledstrip = require('../modules/ledstrip.mod.js');

module.exports = class Config {
    static server = {
        name: "Zengge",
        version: "v1.0.0",
        port: 5500
    };
    static bluetooth = {
        device: "hci0"
    }
    static devices = [
        new Ledstrip(0, "Zengge", "08:65:F0:21:2F:A9", "0x200", this.bluetooth.device)
    ]
}