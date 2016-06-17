var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

sources = [
    "sounds/engine.wav",
    "sounds/crash.wav",
    "sounds/countdown.wav"
];

backgroundSound = "sounds/background.mp3";

bkcore.hexgl.Audio = function()
{
    this.engine = null;
    this.crashSoundBuffer = null;
    this.countdownSoundBuffer = null;
    this.background = new Audio(backgroundSound);

    var hidden, visibilityChange;

    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    var self = this;
    if (visibilityChange != "undefined") {
        document.addEventListener(
            visibilityChange,
            function() {
                if (document[hidden]) {
                    self.background.pause();
                }
                else {
                    self.background.play();
                }
            },
            false
        );
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.connect(this.context.destination);

        this.engine = this.context.createBufferSource();
    }

    this.loadInternal = function(url, callback)
    {
        if (!this.context) return;
        
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        var self = this;
        request.onload = function() {
            self.context.decodeAudioData(request.response, function(buffer) {
                callback(buffer);
            }, function() {
                throw new Error("Error decoding audio!");
            });
        };
        request.send();
    }
}

bkcore.hexgl.Audio.prototype.load = function()
{
    var index = 0;

    var self = this;
    function callback(buffer) {
        switch (index) {
            case 0:
                self.engine.buffer = buffer; break;
            case 1:
                self.crashSoundBuffer = buffer; break;
            case 2:
                self.countdownSoundBuffer = buffer; break;
        }
        index++;
    
        if (index < sources.length)
            self.loadInternal(sources[index], callback);
    }

    if (sources.length > 0)
        this.loadInternal(sources[index], callback);
}

bkcore.hexgl.Audio.prototype.startBackground = function()
{
    this.background.loop = true;
    this.background.play();
}

bkcore.hexgl.Audio.prototype.playCrash = function()
{
    var source = this.context.createBufferSource();
    source.buffer = this.crashSoundBuffer;
    source.loop = false;
    source.connect(this.master);
    source.start(0);
}

bkcore.hexgl.Audio.prototype.startVehicleEngine = function()
{
    this.engine.loop = true;
    this.engine.connect(this.master);
    this.engine.playbackRate.value = 1;
    this.engine.start(0);
}

bkcore.hexgl.Audio.prototype.powerVehicleEngine = function(value)
{
    this.engine.playbackRate.value = value;
}

bkcore.hexgl.Audio.prototype.startCountdown = function()
{
    var source = this.context.createBufferSource();
    var gain = this.context.createGain();
    gain.gain.value = 2;
    source.buffer = this.countdownSoundBuffer;
    source.loop = false;
    source.connect(gain);
    gain.connect(this.master);
    source.start(0);
}

bkcore.hexgl.audio = new bkcore.hexgl.Audio();
bkcore.hexgl.audio.load();
