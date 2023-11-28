var shell = require("shelljs");

/**
 * @class Ledstrip
 * @param {string} name The name of the LED strip
 * @param {string} bid The Bluetooth ID of the LED strip
 * @param {string} handle The handle of the LED strip
 * @param {string} device The Bluetooth device to use
 */
class Ledstrip {
    constructor(id, name, bid, handle, device) {
        this.id = id;
        this.name = name;
        this.bid = bid;
        this.handle = handle;
        this.device = device;
        this.counter = 0;
    }

    d2h(d) {
        var s = (+d).toString(16);
        if (s.length < 2) s = '0' + s;
        return s;
    } 

    async enableNotifications() {
        console.log(`Enabling notifications for ${this.name} at handle ${this.handle} on device ${this.bid}`);
        await shell.exec(`gatttool -i ${this.device} -b ${this.bid} --char-write-req -a ${this.handle} -n 0100 --listen`);
        if (shell.error()) return false;
        return true;
    }

    async sendCommand(commandType) {
        this.counter++;
        const payload = this.generatePayload(commandType);
        console.log(`Sending command for ${this.name} with payload ${payload} at handle ${this.handle} on device ${this.bid}`);
        await shell.exec(`gatttool -i ${this.device} -b ${this.bid} --char-write-req -a ${this.handle} -n ${payload}`);
        if (shell.error()) return false;
        return true;
    }

    async setColor(value) {
        // Convert hexadecimal color to RGB
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex, 16);
            return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        };
    
        value = value.replace("#", ""); // Remove the # if it's there
        const rgb = hexToRgb(value);
    
        // Convert RGB to HSV
        const rgbToHsv = (r, g, b) => {
            r /= 255, g /= 255, b /= 255;
    
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, v = max;
    
            const d = max - min;
            s = max === 0 ? 0 : d / max;
    
            if (max === min) {
                h = 0; // achromatic
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
    
            return [Math.round(h * 360 / 2), Math.round(s * 100), Math.round(v * 100)];
        };
    
        const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    
        // Generate payload
        const payload = this.generatePayload("03", hsv[0], hsv[1], hsv[2]);
    
        console.log(`Setting color for ${this.name} to ${value} at handle ${this.handle} on device ${this.bid}`);
        await shell.exec(`gatttool -i ${this.device} -b ${this.bid} --char-write-req -a ${this.handle} -n ${payload}`);
        if (shell.error()) return false;
        return true;
    }

    generatePayload(commandType, hue, saturation, brightness) {
        const counterHex = this.counter.toString(16).padStart(4, '0');
        const commonSection = "8000000d0e0b3b";
        const colorSection = this.rgbToHsvBytes(hue, saturation, brightness);
        const checksum = "00";
    
        return `02${counterHex}001c00180004001217${commandType}${commonSection}${colorSection}00000000${checksum}320000`;
    }

    rgbToHsvBytes(hue, saturation, brightness) {
        const adjustedHue = Math.round(hue / 2);
        const hueByte = this.d2h(adjustedHue);
        const saturationByte = this.d2h(saturation);
        const brightnessByte = this.d2h(brightness);
    
        return `${hueByte}${saturationByte}${brightnessByte}`;
    }
    
    d2h(d) {
        const s = (+d).toString(16);
        return s.length < 2 ? '0' + s : s;
    }

    // async setPower(value) {
    //     // Update this method based on the observed power setting logic
    //     // You may use sendCommand method with the appropriate commandType
    // }

    async setBrightness(value) {
        if (value < 0 || value > 100) throw new Error("Brightness must be between 0 and 100");
        const hsv = [0, 0, value];
    
        // Generate payload
        const payload = this.generatePayload("03", hsv[0], hsv[1], hsv[2]);
    
        console.log(`Setting brightness for ${this.name} to ${value} at handle ${this.handle} on device ${this.bid}`);
        await shell.exec(`gatttool -i ${this.device} -b ${this.bid} --char-write-req -a ${this.handle} -n ${payload}`);
        if (shell.error()) return false;
        return true;
    }    

    // async sendCustom(value) {
    //     // Update this method based on the observed custom command logic
    //     // You may use sendCommand method with the appropriate commandType
    // }
}

module.exports = Ledstrip;