cc.Class({

    extends: cc.Component,

    properties: {

        player: {
            default: null,
            type: require('player'),
        },

        obstaclesPrefab: {
            default: [],
            type: [cc.Prefab],
        },

        startObstaclePrefab: {
            default: null,
            type: cc.Prefab,
        },

        palettePrefab: {
            default: null,
            type: cc.Prefab,
        },

        protectiveProbability: 0.05,

        protectiveCoverPrefab: {
            default: null,
            type: cc.Prefab,
        },

    },

    onLoad () {

        var canvas = cc.find('Canvas');
        this.node.width = canvas.width;
        this.node.height = canvas.height;

        this.obstacleMargin = this.node.height / 3;

        this.palletePool = new cc.NodePool();

    },

    start () {
        // 生成新的障碍
        this.createObstacle(this.obstacleMargin, this.createPallete(this.obstacleMargin), this.startObstaclePrefab);
    },

    update (dt) {

    },

    setColors(optionalColors) {

        this.optionalColors = optionalColors;
        this.primaryColor = optionalColors[0];
        this.usingColorCount = 0;

    },

    moveDown (distance, duration) {

        // 0 是 dead line , 所以从 1 开始。
        var firstChild = this.node.children[1];
        if (firstChild.y + firstChild.height / 2 < -this.node.height / 2) {
            this.node.removeChild(firstChild);
            if (firstChild.group == 'palette') {
                this.palletePool.put(firstChild);
            }
        }

        var lastChild = this.node.children[this.node.childrenCount - 1];
        var lastChildTop = lastChild.y + lastChild.height / 2;
        if(lastChildTop < this.node.height / 2) {
            // 生成新的障碍
            var bottom = lastChildTop + this.obstacleMargin;
            this.createObstacle(bottom, this.createPallete(bottom));
        }

        // 整体移动
        for(var child of this.node.children) {
            if (child.name == 'DeadLine') {
                continue;
            }
            child.runAction(cc.moveBy(duration, cc.v2(0, distance > 0 ? -distance : distance)));
        }

    },

    createPallete (bottom) {

        var palette = this.palletePool.get();
        if (!palette) {
            palette = cc.instantiate(this.palettePrefab);
        }
        this.node.addChild(palette);
        palette.setPosition(new cc.v2(0, bottom - this.obstacleMargin / 2 + palette.height / 2));

        var palleteComponent = palette.getComponent('palette');
        var primaryColor = palleteComponent.setColors(this.optionalColors, this.lastPrimaryColor);

        this.lastPrimaryColor = primaryColor;

        if (Math.random() < this.protectiveProbability) {
            var protectiveCover = cc.instantiate(this.protectiveCoverPrefab);
            this.node.addChild(protectiveCover);
            protectiveCover.setPosition(new cc.v2(palette.x, palette.y));
        }

        return primaryColor;

    },

    createObstacle (bottom, primaryColor, obstaclePrefab) {

        if (this.usingColorCount < this.optionalColors.length) {
            this.usingColorCount++;
        }
        if (!obstaclePrefab) {
            obstaclePrefab = this.obstaclesPrefab[parseInt((Math.random() * this.obstaclesPrefab.length))];
        }
        var obstacle = cc.instantiate(obstaclePrefab);
        this.node.addChild(obstacle);
        obstacle.setPosition(new cc.v2(0, bottom + obstacle.height / 2));

        var scriptName = obstacle.name[0].toLowerCase() + obstacle.name.slice(1);
        obstacle.getComponent(scriptName).setColors(primaryColor, this.optionalColors, this.usingColorCount);

    },

});
