
// いちいち、コールバックで書くと面倒なので一旦使わない。
// var async = require('async');
var _ = require('lodash');
var Weapon = require('../weapon/index').Weapon;
var Protector = require('../protector/index').Protector;

function User(id) {
    this.id = id;
    this.status;
    this.condition;
    this.weapon = new Weapon();
    this.protector = new Protector();
    //this.magic;

    var w = {};
    w.getAttackRoles = function() {
        return {base: 20, ice: 30};
    };
    w.getDefenseRoles = function() {
        return {base: 20, ice: 30};
    };
    this.magic = w;
}
exports.User = User;

// TODO ここに書くのは間違いだが、分けるの面倒だからここで。
function culcDamage(attackRoles, defenseRoles) {
    console.log(attackRoles, defenseRoles);
    var damage = 0;
    Object.keys(attackRoles).forEach(function(attackType) {
        damage += attackRoles[attackType] - (defenseRoles[attackType] || 0);
    });
    return damage;
}

// TODO ここに書くのは間違いだが、分けるの面倒だからここで。
function _attack(target, damege, callback) {
    callback(null, damege); //　本当は、ここでDBを減算
}

/**
 * 武器による攻撃
 * @param {type} target
 * @param {type} callback
 */
User.prototype.attackWeapon = function(target, callback) {

    var attackRoles = this.getAttackRoles();
    var defenseRoles = target.getDefenseRoles();

    var damege = culcDamage(attackRoles, defenseRoles);

    _attack(target, damege, callback);

    // TODO 状態異常の処理も入れる。毒ダメージとかここでsetTimeout()

};

// TODO ここの実装までやると辛いから、一旦全ヒット
User.prototype.isHit = function(target, callback) {
    callback(null, true);
};

// typeに合致したロールを、すべてマージして取得する。
User.prototype.getRoles = function(type) {
    var self = this;
    var roles = {};
    Object.keys(self).forEach(function(key) {
        var getRoleFunc = (self[key] && self[key][type]) || null;
        if (getRoleFunc) {
            roles = _.merge(roles, getRoleFunc(), function(a, b) {
                if (Number.isFinite(a) && Number.isFinite(b)) {
                    return a + b;
                }
                return undefined;
            });
        }
    });
    return roles;
};

/**
 * 攻撃に関係のあるロールを取得する。
 * @param {type} callback
 * @return 攻撃に関係のあるロール
 */
User.prototype.getAttackRoles = function(callback) {
    return this.getRoles('getAttackRoles');
};

/**
 * 防御に関係のあるロールを取得する。
 * @param {type} callback
 * @returns 防御に関係のあるロール
 */
User.prototype.getDefenseRoles = function(callback) {
    return this.getRoles('getDefenseRoles');
};
