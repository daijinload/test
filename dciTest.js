
var User = require('./lib/user/core').User;

function main(callback) {
    var attacker = new User(1);
    var receiver = new User(2);

    attacker.isHit(receiver, function(err, _isHit) {
        if (err || !_isHit) {
            callback(err);
            return;
        }
        attacker.attackWeapon(receiver, callback);
    });
}
main(console.log);
