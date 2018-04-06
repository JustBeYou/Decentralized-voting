var express = require('express');
var blockchain = require('../blockchain');
var config = require('../config');
var router = express.Router();
var web3 = require('web3');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Decentralized Voting'});
});

function sendPercentages(results, res) {
    var total = 0;
    var keys = Object.keys(results);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        total += parseInt(results[key]);
    }
    console.log(total, results);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (total == 0) {
            results[key] = 0;
        } else {
            results[key] = parseInt(results[key]) / total * 100;
        }
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
}

function getPercentages(index, candidates, results, res, finish_callback) {
    if (index == candidates.length) {
        finish_callback(results, res);
        return ;
    }

    config.mainContractInstance.methods.GetTotalVotesOf(web3.utils.asciiToHex(candidates[index])).call(
        {
            from: config.defaultAccount
        },
        function (error, result) {
            results[candidates[index]] = result;

            getPercentages(index + 1, candidates, results, res, finish_callback);
        }
    );
}

router.get('/percentage', function (req, res, next) {
    var candidates = ['Donald Trump', 'Hillary Clinton'];
    var results = {};

    getPercentages(0, candidates, results, res, sendPercentages);
});

router.post('/vote', function (req, res, next) {
    var candidate = req.body.candidate;
    console.log(candidate);

    config.mainContractInstance.methods.VoteForCandidate(web3.utils.asciiToHex(candidate)).send(
        {
            from: config.defaultAccount
        },
        function (error, result) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({msg: "Voted for " + candidate}));
        }
    );
})

module.exports = router;
