cc.Class({

    extends: cc.Component,

    properties: {

        lastScoreKey : {
            default: 'lastScore',
            visible: false,
        },

        historyScoresKey : {
            default: 'historyScores',
            visible: false,
        },

    },

    onLoad () {
        
    },

    start () {

    },

    update (dt) {

    },

    setNewScore (newScore) {
    
        cc.sys.localStorage.setItem(this.lastScoreKey, newScore);

        var historyScores = this.getHistoryScores();

        if (!historyScores) {
            historyScores = [ 0, 0, 0 ];
        }

        historyScores.push(newScore);
        for (var i = historyScores.length - 1; i > 0; i--) {
            if (historyScores[i] > historyScores[i - 1]) {
                var temp = historyScores[i];
                historyScores[i] = historyScores[i - 1];
                historyScores[i - 1] = temp;
            } else {
                break;
            }
        }
        historyScores.pop();

        cc.sys.localStorage.setItem(this.historyScoresKey, JSON.stringify(historyScores));

    },

    getLastScore () {

        return cc.sys.localStorage.getItem(this.lastScoreKey);

    },

    getHistoryScores () {
        
        var historyScores = cc.sys.localStorage.getItem(this.historyScoresKey);
        
        return historyScores ? JSON.parse(historyScores) : historyScores;

    },

});
